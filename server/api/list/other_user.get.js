const schema = {
	type: 'object',
	properties: {
		username: { type: 'string', minLength: 4 }
	},
	required: ['username'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		let validation = req.validate(schema, req.query)
		if (validation.error) return res.setStatus(400).send(validation)

		const userExist = await mongo.client
			.db('MTAlist')
			.collection('Users')
			.findOne({ username: req.query.username, mailVerified: true }, { projection: { _id: 1 } })

		if (!userExist) return res.setStatus(404).send()

		const got = await mongo.client
			.db('MTAlist')
			.collection('Lists')
			.findOne({ _id: userExist._id }, { projection: { _id: 0 } })

		return res.send({ data: got })
	} catch (e) {
		return responseError(e, res)
	}
})
