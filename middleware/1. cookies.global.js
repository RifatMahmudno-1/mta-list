export default defineNuxtRouteMiddleware(async () => {
	const cookies = ['TokenS', 'TokenP', 'Stay']
	const maxAge = useCookie('Stay').value === 'Yes' ? 2592000 : null

	for (let i = 0; i < cookies.length; i++) {
		const cookie = useCookie(cookies[i], { path: '/', ...(maxAge ? { maxAge } : {}) })
		const oldValue = cookie.value
		if (oldValue !== undefined) continue
		cookie.value = ''
		await nextTick()
		cookie.value = oldValue
	}
	if (process.server) return
	// delete unnecessary cookies
	globalThis.document.cookie
		.split('; ')
		.map(el => el.split('=')[0])
		.forEach(el => {
			if (!el) return
			if (!cookies.includes(el)) useCookie(el).value = null
		})
})
