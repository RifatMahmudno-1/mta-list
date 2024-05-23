export default defineEventHandler(async ev => {
	return send(ev, 'This is the API of this website')
})
