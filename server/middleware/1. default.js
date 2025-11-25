export default defineEventHandler(async ev => {
	// remove trailing slash for GET requests
	if (ev.method === 'GET' && ev.path !== '/' && ev.path.endsWith('/')) return sendRedirect(ev, ev.path.slice(0, -1))

	const url = getRequestURL(ev)

	// client side rendering, mainly for PWA
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
		if (mongo.connected) {
			// don't wait and ignore error
			Promise.allSettled([mongo.client.db('MTAlist').collection('Users').createIndex({ email: 1 }), mongo.client.db('MTAlist').collection('Users').createIndex({ username: 1 })])
		}

		if (!mongo.connected) {
			setResponseStatus(ev, 500)
			return send(ev)
		}
	}
})
