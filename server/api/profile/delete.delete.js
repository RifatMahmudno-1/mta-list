import { compareSync } from 'bcrypt'

const schema = {
	type: 'object',
	properties: {
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

		if (!compareSync(req.body.pass, dbData.pass)) return res.send({ status: 'wrongPass' })

		await mongo.client.db('MTAlist').collection('Users').deleteOne({ _id: dbData._id })

		return res.deleteCookie('TokenP').deleteCookie('TokenS').deleteCookie('Stay').send({ status: 'success' })
	} catch (e) {
		return responseError(e, res)
	}
})
