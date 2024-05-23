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
		}
	},
	required: ['page'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		const { tmdbType, tmdbTypeError } = tmdbTE(req)
		if (!tmdbType) return tmdbTypeError

		let validation = req.validate(schema, req.query)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await $fetch(`https://api.themoviedb.org/3/${tmdbType}/top_rated`, {
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
