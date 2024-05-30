import { customAlphabet } from 'nanoid'

const schema = {
	type: 'object',
	properties: {
		email: { type: 'string', minLength: 8 },
		code: { type: 'string', minLength: 8, maxLength: 8 }
	},
	required: ['email'],
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
		if (got.mailVerified) return res.send({ status: 'alreadyVerified' })

		const verifyObj = await mongo.client.db('MTAlist').collection('MailVerifyCodes').findOne({ _id: got._id })

		if (!verifyObj || verifyObj.time + 600_000 < Date.now()) {
			const code = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)()
			const time = Date.now()
			await mongo.client.db('MTAlist').collection('MailVerifyCodes').updateOne({ _id: got._id }, { $set: { code, time } }, { upsert: true })

			await sendMail({ to: req.body.email, subject: 'Reset password', text: `Your new code verify your email is: ${code}\nGo to ${req.url.origin}/verify_email and enter this code to verify.\nThis code will expire after 10 minutes.` })

			return res.send({ status: 'notVerified', refreshed: true })
		}

		if (!req.body.code || verifyObj.code !== req.body.code) return res.send({ status: 'notVerified', noCode: req.body.code ? false : true })

		await Promise.all([
			mongo.client.db('MTAlist').collection('MailVerifyCodes').deleteOne({ _id: got._id }),
			mongo.client
				.db('MTAlist')
				.collection('Users')
				.updateOne({ _id: got._id }, { $set: { mailVerified: true, credentialsChangedAt: Date.now() } })
		])

		return res.send({ status: 'success' })
	} catch (e) {
		return responseError(e, res)
	}
})
