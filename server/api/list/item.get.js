const schema = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			ValidateByFunction: data => {
				let num = parseInt(data)
				if (num != data || isNaN(num)) return false
				if (num <= 0) return false
				return true
			}
		},
		type: { type: 'string', enum: ['tv', 'movie', 'anime'] }
	},
	required: ['id', 'type'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		let validation = req.validate(schema, req.query)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await mongo.client
			.db('MTAlist')
			.collection('Lists')
			.findOne({ _id: ev.cache.userData._id }, { projection: { _id: 0, [`list.${req.query.type}_${req.query.id}`]: 1 } })

		return res.send({ data: got?.list?.[`${req.query.type}_${req.query.id}`] || null })
	} catch (e) {
		return responseError(e, res)
	}
})
