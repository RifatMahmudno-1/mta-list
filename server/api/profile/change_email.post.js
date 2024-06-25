import { compareSync } from 'bcrypt'
import { customAlphabet } from 'nanoid'

const getCode = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
const send_mail = (req, code) => sendMail({ to: req.body.new_email, subject: 'Verify New Email', text: `Your new code verify your new email is: ${code}\nGo to ${req.url.origin}/profile and enter this code to verify.\nThis code will expire after 10 minutes.` })

const schema = {
	type: 'object',
	oneOf: [
		{
			properties: {
				new_email: { type: 'string', minLength: 8 },
				pass: { type: 'string', minLength: 6 }
			},
			required: ['new_email', 'pass'],
			additionalProperties: false
		},
		{
			properties: {
				new_email: { type: 'string', minLength: 8 },
				pass: { type: 'string', minLength: 6 },
				code: { type: 'string', minLength: 8, maxLength: 8 }
			},
			required: ['new_email', 'pass', 'code'],
			additionalProperties: false
		}
	]
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		await req.parseBody()
		let validation = req.validate(schema, req.body)
		if (validation.error) return res.setStatus(400).send(validation)

		const dbData = ev.cache.userData

		if (!compareSync(req.body.pass, dbData.pass)) return res.send({ status: 'wrongPass' })

		if (
			await mongo.client
				.db('MTAlist')
				.collection('Users')
				.findOne({ email: req.body.new_email }, { projection: { _id: 1 } })
		) {
			if (dbData.new_email) {
				await mongo.client
					.db('MTAlist')
					.collection('Users')
					.updateOne({ _id: dbData._id }, { $unset: { new_email: '' } })
				await mongo.client.db('MTAlist').collection('NewMailVerifyCodes').deleteOne({ _id: dbData._id })
			}
			return res.send({ status: 'emailInUse' })
		}

		if (dbData.new_email && dbData.new_email !== req.body.new_email) throw "Existing emails didn't match"

		const got = await mongo.client.db('MTAlist').collection('NewMailVerifyCodes').findOne({ _id: dbData._id })

		if (!dbData.new_email || !got || got.time + 600_000 < Date.now()) {
			if (!dbData.new_email) {
				await mongo.client
					.db('MTAlist')
					.collection('Users')
					.updateOne({ _id: dbData._id }, { $set: { new_email: req.body.new_email } })
			}

			const time = Date.now()
			const code = getCode()
			await mongo.client.db('MTAlist').collection('NewMailVerifyCodes').updateOne({ _id: dbData._id }, { $set: { time, code } }, { upsert: true })
			await send_mail(req, code)
			return res.send({ status: 'sentCode', expired: dbData.new_email && got })
		}

		if (req.body.code) {
			if (req.body.code !== got.code) return res.send({ status: 'invalidCode' })
			await mongo.client.db('MTAlist').collection('NewMailVerifyCodes').deleteOne({ _id: dbData._id })
			const modifiedAt = Date.now()
			const credentialsChangedAt = modifiedAt + Math.floor(Math.random() * 200) + 1
			await mongo.client
				.db('MTAlist')
				.collection('Users')
				.updateOne(
					{ _id: dbData._id },
					{
						$unset: { new_email: '' },
						$set: {
							email: req.body.new_email,
							credentialsChangedAt,
							modifiedAt
						}
					}
				)
			return res
				.setCookie('TokenS', await aesEncrypt(dbData._id + '::' + credentialsChangedAt + (dbData.admin ? '::Yes' : ''), process.env.CookiePrivateKey), {
					path: '/',
					maxAge: req.cookies.Stay === 'Yes' ? 2592000 : null
				})
				.send({ status: 'success', modifiedAt })
		}

		return res.send({ status: 'askCode' })
	} catch (e) {
		return responseError(e, res)
	}
})
