/**
 * @param {String} text
 * @param {Boolean|Undefined} isError
 * @returns {Undefined}
 */
export function setNoti(text, isError) {
	if (process.server) return

	const key = globalThis.crypto.randomUUID()
	if (!Array.isArray(useState('noti').value)) useState('noti', () => [{ text: text, error: isError ? true : false, key }])
	else {
		useState('noti').value.push({ text: text, error: isError ? true : false, key })
	}

	if (process.client) {
		setTimeout(() => {
			const notis = useState('noti')
			if (!Array.isArray(notis.value)) return
			const ind = notis.value.findIndex(el => el.key === key)
			if (ind >= 0 && notis.value[ind]) notis.value.splice(ind, 1)
		}, 8 * 1000)
	}
}

/**@returns {globalThis.Ref<Object[]>} */
export function getNoti() {
	if (!Array.isArray(useState('noti').value)) useState('noti')
	return useState('noti')
}
