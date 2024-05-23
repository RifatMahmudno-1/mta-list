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
	required: ['id'],
	additionalProperties: false
}

export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		let validation = req.validate(schema, req.params)
		if (validation.error) return res.setStatus(400).send(validation)

		const got = await $fetch('https://graphql.anilist.co', {
			method: 'POST',
			body: {
				query: gql`
					{
						Media(id: ${req.params.id}) {
							id
							title {
								romaji
								english
								native
								userPreferred
							}
							genres
							bannerImage
							coverImage {
								large
							}
							description(asHtml: false)
							popularity
							averageScore
							characters {
								edges {
									role
									node {
										name {
											userPreferred
										}
										image {
											large
										}
									}
								}
							}
							staff {
								edges {
									role
									node {
										name {
											userPreferred
										}
										image {
											large
										}
									}
								}
							}
						}
					}
				`
			}
		})

		return res.send(parseDetails(got))
	} catch (e) {
		return responseError(e, res)
	}
})

function parseDetails(got) {
	got = got.data.Media
	return {
		id: got.id,
		genres: got.genres,
		banner: got.bannerImage,
		poster: got.coverImage.large,
		title: got.title.romaji,
		description: got.description || '',
		averageScore: got.averageScore ? Number((got.averageScore / 10).toFixed(2)) : 0,
		popularity: got.popularity ? Number(got.popularity.toFixed(2)) : 0,
		other_titles: Object.values(got.title).filter(el => el && el !== got.title.romaji),
		characters: got.characters.edges.map(el => ({
			role: el.role,
			name: el.node.name.userPreferred,
			poster: el.node.image.large
		})),
		staffs: got.staff.edges.map(el => ({
			role: el.role,
			name: el.node.name.userPreferred,
			poster: el.node.image.large
		}))
	}
}
