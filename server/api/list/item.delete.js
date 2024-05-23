const schema = {
	type: 'object',
	properties: {
		id: { type: 'integer', minimum: 0 },
		type: { type: 'string', enum: ['tv', 'movie', 'anime'] }
	},
	required: ['id', 'type'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		await req.parseBody()

		let validation = req.validate(schema, req.body)
		if (validation.error) return res.setStatus(400).send(validation)

		await mongo.client
			.db('MTAlist')
			.collection('Lists')
			.updateOne({ _id: ev.cache.userData._id }, { $unset: { [`list.${req.body.type}_${req.body.id}`]: '' } })

		return res.send({ status: 'success' })
	} catch (e) {
		return responseError(e, res)
	}
})
