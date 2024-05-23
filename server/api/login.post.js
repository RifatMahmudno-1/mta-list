import { compareSync } from 'bcrypt'

const schema = {
	type: 'object',
	properties: {
		email: { type: 'string', minLength: 8 },
		pass: { type: 'string', minLength: 6 },
		stay: { type: 'boolean' }
	},
	required: ['email', 'pass', 'stay'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	res.deleteCookie('TokenP').deleteCookie('TokenS').deleteCookie('Stay')

	try {
		await req.parseBody()
		let validation = req.validate(schema, req.body)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await mongo.client.db('MTAlist').collection('Users').findOne({ email: req.body.email })

		if (!got) return res.send({ status: 'notRegistered' })
		if (!compareSync(req.body.pass, got.pass)) return res.send({ status: 'wrongPass' })

		return res
			.setCookie('TokenS', await aesEncrypt(got._id + '::' + got.credentialsChangedAt + (got.admin ? '::Yes' : ''), process.env.CookiePrivateKey), {
				path: '/',
				maxAge: req.body.stay ? 2592000 : null
			})
			.setCookie('TokenP', await aesEncrypt('MTAlist' + (got.admin ? '::1' : ''), process.env.VITE_CookiePublicKey), {
				path: '/',
				maxAge: req.body.stay ? 2592000 : null
			})
			.setCookie('Stay', req.body.stay ? 'Yes' : 'No', {
				path: '/',
				maxAge: req.body.stay ? 2592000 : null
			})
			.send({ status: 'success' })
	} catch (e) {
		return responseError(e, res)
	}
})
