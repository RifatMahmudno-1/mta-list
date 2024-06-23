import { hashSync } from 'bcrypt'

const schema = {
	type: 'object',
	properties: {
		email: { type: 'string', minLength: 8 },
		pass: { type: 'string', minLength: 6 },
		name: { type: 'string', minLength: 4 },
		username: { type: 'string', minLength: 4, pattern: '^[a-z0-9_.-]+$' }
	},
	required: ['email', 'pass', 'name', 'username'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	res.deleteCookie('TokenP').deleteCookie('TokenS').deleteCookie('Stay')

	try {
		await req.parseBody()
		let validation = req.validate(schema, req.body)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await mongo.client
			.db('MTAlist')
			.collection('Users')
			.find({ $or: [{ email: req.body.email }, { username: req.body.username }] })
			.toArray()

		if (got.find(el => el.email === req.body.email)) {
			if (!got.find(el => el.email === req.body.email).mailVerified) return res.send({ status: 'mailNotVerified' })
			return res.send({ status: 'alreadyRegistered' })
		}

		if (got.find(el => el.username === req.body.username)) return res.send({ status: 'usernameTaken' })

		const _id = new mongo.ObjectId().toString()
		const credentialsChangedAt = Date.now()
		await mongo.client
			.db('MTAlist')
			.collection('Users')
			.insertOne({
				_id,
				name: req.body.name,
				username: req.body.username,
				pass: hashSync(req.body.pass, 10),
				email: req.body.email,
				credentialsChangedAt,
				mailVerified: false
			})

		return res.send({ status: 'success' })
	} catch (e) {
		return responseError(e, res)
	}
})
