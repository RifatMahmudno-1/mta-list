import { compareSync, hashSync } from 'bcrypt'

const schema = {
	type: 'object',
	properties: {
		new_pass: { type: 'string', minLength: 6 },
		pass: { type: 'string', minLength: 6 }
	},
	required: ['pass', 'new_pass'],
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

		const modifiedAt = Date.now()
		const credentialsChangedAt = modifiedAt + Math.floor(Math.random() * 200) + 1
		const stay = req.cookies.Stay === 'Yes'
		await mongo.client
			.db('MTAlist')
			.collection('Users')
			.updateOne(
				{ _id: dbData._id },
				{
					$set: {
						pass: hashSync(req.body.new_pass, 10),
						modifiedAt,
						credentialsChangedAt
					}
				}
			)

		return res
			.setCookie('TokenS', await aesEncrypt(dbData._id + '::' + credentialsChangedAt + (dbData.admin ? '::Yes' : ''), process.env.CookiePrivateKey), {
				path: '/',
				maxAge: stay ? 2592000 : null
			})
			.setCookie('TokenP', await aesEncrypt(`MTAlist::${dbData.username}${dbData.admin ? '::1' : ''}`, process.env.VITE_CookiePublicKey), {
				path: '/',
				maxAge: stay ? 2592000 : null
			})
			.setCookie('Stay', stay ? 'Yes' : 'No', {
				path: '/',
				maxAge: stay ? 2592000 : null
			})
			.send({ status: 'success', modifiedAt })
	} catch (e) {
		return responseError(e, res)
	}
})
