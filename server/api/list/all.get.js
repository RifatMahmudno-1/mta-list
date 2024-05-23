export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		const got = await mongo.client
			.db('MTAlist')
			.collection('Lists')
			.findOne({ _id: ev.cache.userData._id }, { projection: { _id: 0 } })

		return res.send({ data: got })
	} catch (e) {
		return responseError(e, res)
	}
})
