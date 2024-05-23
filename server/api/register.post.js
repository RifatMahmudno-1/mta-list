import { hashSync } from 'bcrypt'

const schema = {
	type: 'object',
	properties: {
		email: { type: 'string', minLength: 8 },
		pass: { type: 'string', minLength: 6 },
		name: { type: 'string', minLength: 4 },
		stay: { type: 'boolean' }
	},
	required: ['email', 'pass', 'name', 'stay'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	res.deleteCookie('TokenP').deleteCookie('TokenS').deleteCookie('Stay')

	try {
		await req.parseBody()
		let validation = req.validate(schema, req.body)
		if (validation.error) return res.setStatus(400).send(validation)

		if (await mongo.client.db('MTAlist').collection('Users').findOne({ email: req.body.email })) return res.send({ status: 'alreadyRegistered' })

		const _id = new mongo.ObjectId().toString()
		const credentialsChangedAt = Date.now()
		await mongo.client
			.db('MTAlist')
			.collection('Users')
			.insertOne({
				_id,
				name: req.body.name,
				pass: hashSync(req.body.pass, 10),
				email: req.body.email,
				credentialsChangedAt
			})

		return res
			.setCookie('TokenS', await aesEncrypt(_id + '::' + credentialsChangedAt, process.env.CookiePrivateKey), {
				path: '/',
				maxAge: req.body.stay ? 2592000 : null
			})
			.setCookie('TokenP', await aesEncrypt('MTAlist', process.env.VITE_CookiePublicKey), {
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
