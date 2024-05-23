export default (e, res) => {
	console.log(e)
	return res.sendStatus(e?.statusCode || 500)
}
