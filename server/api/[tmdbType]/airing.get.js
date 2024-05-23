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
		status: {
			type: 'string',
			enum: ['on_the_air', 'airing_today', 'now_playing']
		}
	},
	required: ['page', 'status'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		const { tmdbType, tmdbTypeError } = tmdbTE(req)
		if (!tmdbType) return tmdbTypeError

		let validation = req.validate(schema, req.query)
		if (validation.error) return res.setStatus(400).send(validation)

		// airing_today, on_the_air is only for tv
		if (tmdbType === 'tv' && req.query.status !== 'airing_today' && req.query.status !== 'on_the_air') return tmdbTypeError

		// now_playing is only for movie
		if (tmdbType === 'movie' && req.query.status !== 'now_playing') return tmdbTypeError

		const got = await $fetch(`https://api.themoviedb.org/3/${tmdbType}/${req.query.status}`, {
			query: { page: req.query.page },
			headers: tmdbHeaders,
			method: 'GET'
		})

		const genres = await $fetch(`/api/${tmdbType}/genres`)

		return res.send(parseTmdb(got, genres))
	} catch (e) {
		return responseError(e, res)
	}
})
