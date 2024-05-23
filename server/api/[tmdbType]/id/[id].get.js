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
		}
	},
	required: ['id']
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		const { tmdbType, tmdbTypeError } = tmdbTE(req)
		if (!tmdbType) return tmdbTypeError

		let validation = req.validate(schema, req.params)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await $fetch(`https://api.themoviedb.org/3/${tmdbType}/${req.params.id}`, {
			headers: tmdbHeaders,
			method: 'GET',
			query: { append_to_response: ['credits', 'alternative_titles'].join(',') }
		})

		return res.send(parseDetails(got))
	} catch (e) {
		return responseError(e, res)
	}
})

function parseDetails(got) {
	return {
		id: got.id,
		genres: got.genres?.map(el => el.name) || [],
		banner: got.backdrop_path ? 'https://image.tmdb.org/t/p/w1280' + got.backdrop_path : null,
		poster: got.poster_path ? 'https://image.tmdb.org/t/p/w342' + got.poster_path : null,
		title: got.name || got.title,
		description: got.overview || '',
		averageScore: got.vote_average ? Number(got.vote_average.toFixed(2)) : 0,
		popularity: got.popularity ? Number(got.popularity.toFixed(2)) : 0,
		other_titles: got.alternative_titles.titles ? got.alternative_titles.titles.map(el => el.title) : got.alternative_titles.results ? got.alternative_titles.results.map(el => el.title) : [],
		characters: got.credits?.cast?.map(el => ({
			role: el.character,
			name: el.name,
			poster: el.profile_path ? 'https://image.tmdb.org/t/p/w342' + el.profile_path : null
		})),
		staffs: got.credits?.crew?.map(el => ({
			role: el.job,
			name: el.name,
			poster: el.profile_path ? 'https://image.tmdb.org/t/p/w342' + el.profile_path : null
		}))
	}
}
