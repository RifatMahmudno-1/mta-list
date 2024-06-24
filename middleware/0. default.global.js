export default defineNuxtRouteMiddleware(to => {
	if (to.path !== '/' && to.path.endsWith('/')) {
		to.path = to.path.slice(0, -1)
		return navigateTo(to)
	}
})
