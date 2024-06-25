import { hashSync, compareSync } from 'bcrypt'

const schema = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 4 },
		username: { type: 'string', minLength: 4, pattern: '^[a-z0-9_.-]+$' },
		new_pass: { type: 'string', minLength: 6 },
		pass: { type: 'string', minLength: 6 }
	},
	required: ['pass'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		await req.parseBody()
		let validation = req.validate(schema, req.body)
		if (validation.error) return res.setStatus(400).send(validation)

		const dbData = ev.cache.userData

		if (dbData.name === req.body.name || dbData.username === req.body.username) throw 'Same data sent'

		if (!compareSync(req.body.pass, dbData.pass)) return res.send({ status: 'wrongPass' })

		// delete account
		if (Object.keys(req.body).length === 1) {
			await mongo.client.db('MTAlist').collection('Users').deleteOne({ _id: ev.cache.userData._id })
			await mongo.client.db('MTAlist').collection('Lists').deleteOne({ _id: ev.cache.userData._id })
			return res.deleteCookie('TokenP').deleteCookie('TokenS').deleteCookie('Stay').send({ status: 'success' })
		}

		if (req.body.username) {
			const got = await mongo.client
				.db('MTAlist')
				.collection('Users')
				.findOne({ username: req.body.username }, { projection: { _id: 1 } })
			if (got) return res.send({ status: 'usernameTaken' })
		}

		const time = Date.now()
		let cTime = null
		delete req.body.pass
		if (req.body.new_pass) {
			req.body.pass = hashSync(req.body.new_pass, 10)
			delete req.body.new_pass
		}
		if (req.body.pass) {
			cTime = Date.now()
			req.body.credentialsChangedAt = cTime
		}

		await mongo.client
			.db('MTAlist')
			.collection('Users')
			.updateOne(
				{ _id: dbData._id },
				{
					$set: {
						...req.body,
						modifiedAt: time
					}
				}
			)

		if (cTime) {
			const stay = req.cookies.Stay === 'Yes'
			res
				.setCookie('TokenS', await aesEncrypt(dbData._id + '::' + cTime + (dbData.admin ? '::Yes' : ''), process.env.CookiePrivateKey), {
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
		}

		return res.send({ status: 'success', modifiedAt: time })
	} catch (e) {
		return responseError(e, res)
	}
})
