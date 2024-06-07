export default defineEventHandler(async ev => {
	const url = getRequestURL(ev)
	if (url.pathname === '/' && url.searchParams.get('csr') === '1') ev.context.nuxt = { noSSR: true }

	/**
	 * try to connect to server on any request made to any route starting with /api
	 * if fails send 500 error
	 */
	if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
		if (mongo.connected) return

		await mongo.init()
		if (!mongo.connected) {
			setResponseStatus(ev, 500)
			return send(ev)
		}
	}
})
