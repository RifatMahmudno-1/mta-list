export default defineEventHandler(ev => {
	if (ev.path !== '/' && ev.path.endsWith('/')) return createError({ statusCode: 404 })
})
