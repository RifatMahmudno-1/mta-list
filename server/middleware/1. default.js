export default defineEventHandler(async ev => {
	try {
		if (ev.path === '/?csr=1') ev.context.nuxt = { noSSR: true }
		if (ev.path !== '/api' && !ev.path.startsWith('/api/')) return

		if (!mongo.connected) {
			await mongo.init()
			if (!mongo.connected) throw Error('Mongo connection failed')
		}
	} catch (e) {
		mongo.connected = false
		console.log(e)
		setResponseStatus(ev, 500)
		return send(ev)
	}
})
