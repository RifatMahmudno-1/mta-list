import { hashSync } from 'bcrypt'

const schema = {
	type: 'object',
	oneOf: [
		{
			properties: {
				email: { type: 'string', minLength: 8 }
			},
			required: ['email'],
			additionalProperties: false
		},
		{
			properties: {
				email: { type: 'string', minLength: 8 },
				pass: { type: 'string', minLength: 6 },
				code: { type: 'string', minLength: 16 }
			},
			required: ['email', 'pass', 'code'],
			additionalProperties: false
		}
	]
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
		if (!got.mailVerified) return res.send({ status: 'mailNotVerified' })

		const verifyObj = await mongo.client.db('MTAlist').collection('ResetPassCodes').findOne({ _id: got._id })

		if (!verifyObj || verifyObj.time + 600_000 < Date.now()) {
			const code = getRandomString(16)
			const time = Date.now()
			await mongo.client.db('MTAlist').collection('ResetPassCodes').updateOne({ _id: got._id }, { $set: { code, time } }, { upsert: true })

			await sendMail({ to: req.body.email, subject: 'Reset password', text: `We received a request to reset your password.\nYour new code is: ${code}\nGo to ${req.url.origin}/reset_password and use this code to set new password.\nThis code will expire after 10 minutes.` })

			return res.send({ status: 'notSuccess', refreshed: true })
		}

		if (!req.body.code || verifyObj.code !== req.body.code) return res.send({ status: 'notSuccess', noCode: req.body.code ? false : true })

		await Promise.all([
			mongo.client.db('MTAlist').collection('ResetPassCodes').deleteOne({ _id: got._id }),
			mongo.client
				.db('MTAlist')
				.collection('Users')
				.updateOne({ _id: got._id }, { $set: { pass: hashSync(req.body.pass, 10), credentialsChangedAt: Date.now() } })
		])

		return res.send({ status: 'success' })
	} catch (e) {
		return responseError(e, res)
	}
})
