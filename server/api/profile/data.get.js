export default defineEventHandler(async ev => {
	const { res } = modifyH3(ev)

	try {
		return res.send({
			name: ev.cache.userData.name,
			username: ev.cache.userData.username,
			email: ev.cache.userData.email,
			new_email: ev.cache.userData.new_email || '',
			modifiedAt: ev.cache.userData.modifiedAt || null
		})
	} catch (e) {
		return responseError(e, res)
	}
})
