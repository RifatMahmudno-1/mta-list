export default defineNitroPlugin(async () => {
	if (!mongo.connected) await mongo.init()
})
