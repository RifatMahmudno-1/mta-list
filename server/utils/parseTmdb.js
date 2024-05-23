const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default (got, genres = []) => {
	const obj = { hasNextPage: false, results: [] }
	if (got?.page < got?.total_pages) obj.hasNextPage = true
	got?.results?.forEach?.(el => {
		const ob = {
			id: el.id,
			title: el.name || el.title,
			otherTitle: el.original_name || el.original_title,
			genres: el.genre_ids ? genres.filter(e => el.genre_ids.includes(e.id)).map(el => el.name) : [],
			description: el.overview,
			startDate: (() => {
				if (!el.first_air_date && !el.release_date) return null
				const date = (el.first_air_date || el.release_date)?.split?.('-')
				if (date.length !== 3) return null

				return `${date[2]} ${months[Number(date[1])]}, ${date[0]}`
			})(),
			poster: el.poster_path ? 'https://image.tmdb.org/t/p/w342' + el.poster_path : null,
			banner: el.backdrop_path ? 'https://image.tmdb.org/t/p/w1280' + el.backdrop_path : null,
			averageScore: el.vote_average ? Number(el.vote_average.toFixed(2)) : 0,
			popularity: el.popularity ? Number(el.popularity.toFixed(2)) : 0
		}
		obj.results.push(ob)
	})

	return obj
}
