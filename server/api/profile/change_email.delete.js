export default defineEventHandler(async ev => {
	const { req, res } = modifyH3(ev)

	try {
		const dbData = ev.cache.userData

		await mongo.client
			.db('MTAlist')
			.collection('Users')
			.updateOne({ _id: dbData._id }, { $unset: { new_email: '' } })
		await mongo.client.db('MTAlist').collection('NewMailVerifyCodes').deleteOne({ _id: dbData._id })

		return res.send({ status: 'success' })
	} catch (e) {
		return responseError(e, res)
	}
})
