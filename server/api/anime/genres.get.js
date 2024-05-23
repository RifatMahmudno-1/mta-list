export default defineEventHandler(async ev => {
	const { res } = modifyH3(ev)

	try {
		const got = await $fetch('https://graphql.anilist.co', {
			method: 'POST',
			body: {
				query: gql`
					{
						GenreCollection
					}
				`
			}
		})

		return res.send(got?.data?.GenreCollection || [])
	} catch (e) {
		return responseError(e, res)
	}
})
