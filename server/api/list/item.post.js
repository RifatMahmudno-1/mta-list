const schema = {
	type: 'object',
	properties: {
		id: { type: 'integer', minimum: 0 },
		type: { type: 'string', enum: ['tv', 'movie', 'anime'] },
		poster: { type: 'string' },
		banner: { type: 'string' },
		title: { type: 'string', minLength: 1 },
		status: { type: 'string', enum: ['completed', 'watching', 'watched', 'planning', 'dropped'] },
		score: { type: 'integer', minimum: 0, maximum: 10 },
		note: { type: 'string', maxLength: 200 },
		favourite: { type: 'boolean' }
	},
	required: ['id', 'type', 'poster', 'banner', 'title', 'status', 'score', 'note', 'favourite'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		await req.parseBody()

		let validation = req.validate(schema, req.body)
		if (validation.error) return res.setStatus(400).send(validation)

		const id = `${req.body.type}_${req.body.id}`
		delete req.body.type
		delete req.body.id

		const time = Date.now()

		await mongo.client
			.db('MTAlist')
			.collection('Lists')
			.updateOne(
				{ _id: ev.cache.userData._id },
				{
					$set: {
						[`list.${id}`]: { ...req.body, lastModified: time },
						lastModified: time
					}
				},
				{ upsert: true }
			)

		return res.send({ lastModified: time })
	} catch (e) {
		return responseError(e, res)
	}
})
