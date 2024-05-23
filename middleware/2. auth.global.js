/**@returns {Promise<String|Boolean>}*/
async function validation(to) {
	const tokenP = useCookie('TokenP').value
	const tokenS = useCookie('TokenS').value
	const stay = useCookie('Stay').value
	if (!tokenP || !tokenS || (stay !== 'Yes' && stay !== 'No')) return false
	try {
		const msg = (await aesDecrypt(tokenP, import.meta.env.VITE_CookiePublicKey)).split('::')
		if (msg.length > 2 || msg[0] !== 'MTAlist' || (msg[1] && msg[1] !== '1')) return false
		to.meta.user = true
		to.meta.admin = msg[1] === '1' ? true : false
		return true
	} catch {
		return false
	}
}

function removeCookie() {
	const tokenP = useCookie('TokenP')
	const tokenS = useCookie('TokenS')
	const stay = useCookie('Stay')

	if (tokenP.value) tokenP.value = null
	if (tokenS.value) tokenS.value = null
	if (stay.value) stay.value = null
}

const guardedRoutes = ['/list']

export default defineNuxtRouteMiddleware(async to => {
	if (!to.matched.length) return

	if (to.path === '/login' || to.path === '/register' || to.path === '/unauthorized') return removeCookie()

	const isValid = await validation(to)
	if (!isValid) removeCookie()

	if (!isValid && guardedRoutes.find(el => to.path.startsWith(el))) return navigateTo('/unauthorized')
})
