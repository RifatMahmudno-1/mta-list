function getFromDB(tmdbType) {
	try {
		let got = kvdb.getItem(`${tmdbType}-genres`)
		if (!got) return false

		got = JSON.parse(got)
		if (!got.lastTime || !got.genres?.length || got.lastTime + 2 * 3600 * 1000 < Date.now()) return false
		return got.genres
	} catch {
		return false
	}
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		const { tmdbType, tmdbTypeError } = tmdbTE(req)
		if (!tmdbType) return tmdbTypeError

		const fromDB = getFromDB(tmdbType)
		if (fromDB) return res.send(fromDB)

		const got = await $fetch(`https://api.themoviedb.org/3/genre/${tmdbType}/list`, {
			headers: tmdbHeaders,
			method: 'GET'
		})

		if (got.genres?.length) kvdb.setItem(`${tmdbType}-genres`, JSON.stringify({ genres: got.genres, lastTime: Date.now() }))

		return res.send(got.genres)
	} catch (e) {
		return responseError(e, res)
	}
})
