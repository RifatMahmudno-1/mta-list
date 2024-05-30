export default len => {
	const allowedChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let str = ''
	for (let i = 0; i < len; i++) {
		const ind = Math.trunc(Math.random() * allowedChars.length)
		str += allowedChars[ind]
	}
	return str
}
