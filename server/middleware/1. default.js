export default defineEventHandler(async ev => {
	if (ev.path !== '/' && ev.path.endsWith('/')) return sendRedirect(ev, ev.path.slice(0, -1))

	const url = getRequestURL(ev)
	if (url.pathname === '/' && url.searchParams.get('csr') === '1') {
		if (ev.context.nuxt?.constructor === Object) ev.context.nuxt.noSSR = true
		else ev.context.nuxt = { noSSR: true }
	}

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
