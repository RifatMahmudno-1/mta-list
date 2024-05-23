const schema = {
	type: 'object',
	properties: {
		page: {
			type: 'string',
			ValidateByFunction: data => {
				let num = parseInt(data)
				if (num != data || isNaN(num)) return false
				if (num <= 0) return false
				return true
			}
		},
		genre: { type: 'string', minLength: 1 }
	},
	required: ['page', 'genre'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		const { tmdbType, tmdbTypeError } = tmdbTE(req)
		if (!tmdbType) return tmdbTypeError

		const genres = await $fetch(`/api/${tmdbType}/genres`)
		const genre_id = genres.find(el => el.name === req.query.genre)?.id
		if (!genre_id) return res.send({ hasNextPage: false, results: [] })

		let validation = req.validate(schema, req.query)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await $fetch(`https://api.themoviedb.org/3/discover/${tmdbType}`, {
			query: { page: req.query.page, with_genres: genre_id },
			headers: tmdbHeaders,
			method: 'GET'
		})

		return res.send(parseTmdb(got, genres))
	} catch (e) {
		return responseError(e, res)
	}
})
