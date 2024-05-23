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
		let validation = req.validate(schema, req.query)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await $fetch('https://graphql.anilist.co', {
			method: 'POST',
			body: {
				query: gql`
					{
						Page(page: ${req.query.page}, perPage: 20) {
							media(type: ANIME, search: "${req.query.query}") {
								id
								title {
									romaji
									english
								}
								genres
								description(asHtml: false)
								startDate {
									year
									month
									day
								}
								coverImage {
									large
								}
								bannerImage
								popularity
								averageScore
							}
							pageInfo {
								hasNextPage
							}
						}
					}
				`
			}
		})

		return res.send(parseAnilist(got))
	} catch (e) {
		return responseError(e, res)
	}
})
