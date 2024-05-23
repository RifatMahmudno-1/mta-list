export default defineNuxtRouteMiddleware(to => {
	if (!['tv', 'movie', 'anime'].includes(to.params.type)) return abortNavigation({ statusCode: 404, message: `Page Not Found: ${to.fullPath}` })
})
