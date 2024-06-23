const guardedRoutes = ['/api/list/']
const guardedRoutesExactExceptions = ['/api/list/other_user']

export default defineEventHandler(async ev => {
	const { pathname } = getRequestURL(ev)

	if (guardedRoutesExactExceptions.find(el => el === pathname)) return
	if (!guardedRoutes.find(el => pathname.startsWith(el))) return

	const { req, res } = modifyH3(ev)
	try {
		const errorAuth = () => res.deleteCookie('TokenS').deleteCookie('TokenP').deleteCookie('Stay').sendStatus(401)

		const { Stay, TokenS, TokenP } = req.cookies
		if (!Stay || (Stay !== 'Yes' && Stay !== 'No') || !TokenS || !TokenP) return errorAuth()

		const decrypted = await aesDecrypt(TokenS, process.env.CookiePrivateKey)
		if (!decrypted.includes('::')) return errorAuth()

		let [_id, credentialsChangedAt, isAdmin] = decrypted.split('::')

		if (isAdmin === 'Yes') isAdmin = true
		else isAdmin = false

		const got = await mongo.client.db('MTAlist').collection('Users').findOne({ _id })

		if (!got || got.credentialsChangedAt?.toString() !== credentialsChangedAt || (isAdmin && !got.admin) || (!isAdmin && got.admin) || (pathname.startsWith('/api/admin/') && !got.admin)) return errorAuth()

		ev.cache.userData = got // save user data
	} catch (e) {
		responseError(e, res)
	}
})
