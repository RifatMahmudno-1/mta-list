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
		query: { type: 'string', minLength: 1 }
	},
	required: ['page', 'query'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		const { tmdbType, tmdbTypeError } = tmdbTE(req)
		if (!tmdbType) return tmdbTypeError

		let validation = req.validate(schema, req.query)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await $fetch(`https://api.themoviedb.org/3/search/${tmdbType}`, {
			query: { page: req.query.page, query: req.query.query },
			headers: tmdbHeaders,
			method: 'GET'
		})

		const genres = await $fetch(`/api/${tmdbType}/genres`)

		return res.send(parseTmdb(got, genres))
	} catch (e) {
		return responseError(e, res)
	}
})
