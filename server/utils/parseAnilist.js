const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default got => {
	const obj = { hasNextPage: false, results: [] }
	if (got?.data?.Page?.pageInfo?.hasNextPage) obj.hasNextPage = true
	got?.data?.Page?.media?.forEach?.(el => {
		const ob = {
			id: el.id,
			title: el.title.romaji,
			otherTitle: el.title.english,
			genres: el.genres,
			description: el.description,
			startDate: el.startDate.day ? `${el.startDate.day} ${months[el.startDate.month - 1]}, ${el.startDate.year}` : null,
			poster: el.coverImage.large,
			banner: el.bannerImage,
			averageScore: el.averageScore ? Number((el.averageScore / 10).toFixed(2)) : 0,
			popularity: el.popularity ? Number(el.popularity.toFixed(2)) : 0
		}
		obj.results.push(ob)
	})

	return obj
}
