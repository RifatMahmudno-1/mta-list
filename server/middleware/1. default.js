export default defineEventHandler(async ev => {
	if (ev.path === '/?csr=1') ev.context.nuxt = { noSSR: true }

	if (ev.path.startsWith('/api/list/')) {
		if (mongo.connected) return

		await mongo.init()
		if (!mongo.connected) {
			setResponseStatus(ev, 500)
			return send(ev)
		}
	}
})
