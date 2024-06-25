import { compareSync } from 'bcrypt'

const schema = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 4 },
		username: { type: 'string', minLength: 4, pattern: '^[a-z0-9_.-]+$' },
		pass: { type: 'string', minLength: 6 }
	},
	required: ['pass', 'name', 'username'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		await req.parseBody()
		let validation = req.validate(schema, req.body)
		if (validation.error) return res.setStatus(400).send(validation)

		const dbData = ev.cache.userData

		if (!compareSync(req.body.pass, dbData.pass)) return res.send({ status: 'wrongPass' })

		if (req.body.username !== dbData.username) {
			const got = await mongo.client
				.db('MTAlist')
				.collection('Users')
				.findOne({ username: req.body.username }, { projection: { _id: 1 } })
			if (got) return res.send({ status: 'usernameTaken' })
		}

		const modifiedAt = Date.now()
		await mongo.client
			.db('MTAlist')
			.collection('Users')
			.updateOne(
				{ _id: dbData._id },
				{
					$set: {
						name: req.body.name,
						username: req.body.username,
						modifiedAt
					}
				}
			)

		return res
			.setCookie('TokenP', await aesEncrypt(`MTAlist::${req.body.username}${dbData.admin ? '::1' : ''}`, process.env.VITE_CookiePublicKey), {
				path: '/',
				maxAge: req.cookies.Stay === 'Yes' ? 2592000 : null
			})
			.send({ status: 'success', modifiedAt })
	} catch (e) {
		return responseError(e, res)
	}
})
