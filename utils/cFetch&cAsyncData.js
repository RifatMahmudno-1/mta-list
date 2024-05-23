import { hash } from 'ohash'

export async function cFetch(/**@type {Parameters<$fetch>[0]} */ url, /**@type {Parameters<$fetch>[1] & {key?:String | typeof ref, watch?:typeof ref[], getCachedData?:Function, transform?:Function, default?:any, server?:Boolean, maxAge?:Number, getFromCache?:Boolean, immediate?:Boolean, lazy?:Boolean}} */ options = {}) {
	const data = ref(null)
	const pending = ref(true)
	const error = ref(null)

	if (!url || typeof url !== 'string') throw Error('[url] must be a not empty string')

	if (Object.prototype.toString.call(options) !== '[object Object]') throw Error(`[options] must be object`)
	if (options.hasOwnProperty('lazy') && typeof options.lazy !== 'boolean') throw Error(`[lazy] must be boolean`)
	if (options.hasOwnProperty('getFromCache') && options.hasOwnProperty('maxAge')) throw Error(`Use either [maxAge] or [getFromCache]. Don't use both`)
	if (options.hasOwnProperty('getFromCache') && typeof options.getFromCache !== 'boolean') throw Error(`[getFromCache] must be boolean`)
	if (options.hasOwnProperty('maxAge') && typeof options.maxAge !== 'number') throw Error(`[maxAge] must be number`)
	if (options.hasOwnProperty('immediate') && typeof options.immediate !== 'boolean') throw Error('[immediate] must be boolean')

	let runOnServer = true
	if (options.hasOwnProperty('server')) {
		if (typeof options.server !== 'boolean') throw Error(`[server] must be boolean`)
		runOnServer = options.server
		delete options.server
	}

	if (options.default) {
		if (typeof options.default !== 'function') throw Error('[default] must be a function')
		data.value = options.default()
		delete options.default
	}

	if (options.watch) {
		if (!Array.isArray(options.watch)) throw Error('[watch] must be Array')
		options.watch.forEach(el => {
			if (!isRef(el)) throw Error('Elements of [watch] must be reactive value.')
		})
		const watchArr = options.watch
		watch(
			computed(() => watchArr.map(el => el.value)),
			() => mainHandler({ url, options }, data, pending, error)
		)
		delete options.watch
	}

	if (process.server && runOnServer && options.immediate !== false) await mainHandler({ url, options }, data, pending, error)
	if (process.client && options.immediate !== false) {
		if (options.lazy || (!runOnServer && useNuxtApp().isHydrating)) mainHandler({ url, options }, data, pending, error)
		else await mainHandler({ url, options }, data, pending, error)
	}

	const refresh = async () => await mainHandler({ url, options }, data, pending, error)
	const execute = async () => {
		if (process.server || !options.lazy) await refresh()
		else refresh()
	}

	return { data, pending, error, refresh, execute }
}
export async function cLazyFetch(/**@type {Parameters<$fetch>[0]} */ url, /**@type {Parameters<$fetch>[1] & {key?:String | typeof ref, watch?:typeof ref[], getCachedData?:Function, transform?:Function, default?:any, server?:Boolean, maxAge?:Number, getFromCache?:Boolean, immediate?:Boolean}} */ options = {}) {
	if (Object.prototype.toString.call(options) !== '[object Object]') throw Error(`[options] must be object`)
	return await cFetch(url, { ...options, lazy: true })
}
export async function cAsyncData(/**@type {String | typeof ref} */ key, /**@type {Function} */ handler, /**@type {{watch?:typeof ref[], getCachedData?:Function, transform?:Function, default?:any, server?:Boolean, maxAge?:Number, getFromCache?:Boolean, immediate?:Boolean, lazy?:Boolean}} */ options = {}) {
	const data = ref(null)
	const pending = ref(true)
	const error = ref(null)

	if (Object.prototype.toString.call(options) !== '[object Object]') throw Error(`[options] must be object`)
	if (options.hasOwnProperty('lazy') && typeof options.lazy !== 'boolean') throw Error(`[lazy] must be boolean`)
	if (options.hasOwnProperty('getFromCache') && options.hasOwnProperty('maxAge')) throw Error(`Use either [maxAge] or [getFromCache]. Don't use both`)
	if (options.hasOwnProperty('getFromCache') && typeof options.getFromCache !== 'boolean') throw Error(`[getFromCache] must be boolean`)
	if (options.hasOwnProperty('maxAge') && typeof options.maxAge !== 'number') throw Error(`[maxAge] must be number`)
	if (options.hasOwnProperty('immediate') && typeof options.immediate !== 'boolean') throw Error('[immediate] must be boolean')

	if (!handler || typeof handler !== 'function') throw Error('[handler] must be a function')

	options.key = key

	let runOnServer = true
	if (options.hasOwnProperty('server')) {
		if (typeof options.server !== 'boolean') throw Error(`[server] must be boolean`)
		runOnServer = options.server
		delete options.server
	}

	if (options.default) {
		if (typeof options.default !== 'function') throw Error('[default] must be a function')
		data.value = options.default()
		delete options.default
	}

	if (options.watch) {
		if (!Array.isArray(options.watch)) throw Error('[watch] must be Array')
		options.watch.forEach(el => {
			if (!isRef(el)) throw Error('Elements of [watch] must be reactive value.')
		})
		const watchArr = options.watch
		watch(
			computed(() => watchArr.map(el => el.value)),
			() => mainHandler({ url, options }, data, pending, error)
		)
		delete options.watch
	}

	if (process.server && runOnServer && options.immediate !== false) await mainHandler({ handler, options }, data, pending, error)
	if (process.client && options.immediate !== false) {
		if (options.lazy || (!runOnServer && useNuxtApp().isHydrating)) mainHandler({ handler, options }, data, pending, error)
		else await mainHandler({ handler, options }, data, pending, error)
	}

	const refresh = async () => await mainHandler({ handler, options }, data, pending, error)
	const execute = async () => {
		if (process.server || !options.lazy) await refresh()
		else refresh()
	}

	return { data, pending, error, refresh, execute }
}
export async function cLazyAsyncData(/**@type {String | typeof ref} */ key, /**@type {Function} */ handler, /**@type {{watch?:typeof ref[], getCachedData?:Function, transform?:Function, default?:any, server?:Boolean, maxAge?:Number, getFromCache?:Boolean, immediate?:Boolean}} */ options = {}) {
	if (Object.prototype.toString.call(options) !== '[object Object]') throw Error(`[options] must be object`)
	return await cAsyncData(key, handler, { ...options, lazy: true })
}

async function mainHandler(mainOpts, data, pending, error) {
	const { payload, isHydrating } = useNuxtApp()
	const { url, options: opts, handler } = mainOpts
	const key = getKey(opts, url)

	pending.value = true
	error.value = null
	if (process.client && !isHydrating) await nextTick()

	if (!payload._errors) payload._errors = {}
	if (!payload.data) payload.data = {}

	if (opts.getCachedData) {
		if (typeof opts.getCachedData !== 'function') throw Error(`[getCachedData] must be a function`)
		let cData = opts.getCachedData(key)
		if (cData !== null && cData !== undefined) {
			if (!isSameKey(opts, key, url)) return
			data.value = cData
			pending.value = false
			return
		}
	}

	if (payload._errors[key] !== undefined && payload._errors[key] !== null) {
		if (!isSameKey(opts, key, url)) return
		error.value = payload._errors[key]
		pending.value = false
		if (process.client) delete payload._errors[key] // delete error so it doesn't appear second time
		return
	}

	if (payload.data[key] !== undefined && payload.data[key] !== null) {
		if (!isSameKey(opts, key, url)) {
			saveTimeHistory(key, payload)
			return
		}
		data.value = payload.data[key]
		if (isHydrating) {
			saveTimeHistory(key, payload)
			pending.value = false
			return
		}
		if (process.client && opts.hasOwnProperty('maxAge') && getTimeHistory(key, payload) + opts.maxAge * 1000 >= Date.now()) {
			pending.value = false
			return
		}
		if (opts.getFromCache) {
			pending.value = false
			return
		}
	}

	if (url) await mainFetch(url, opts, data, pending, error, key, payload)
	else await mainAsyncData(handler, opts, data, pending, error, key, payload)
}

async function mainFetch(url, opts, data, pending, error, key, payload) {
	// options for $fetch
	const options = { ...opts }
	delete options.key
	delete options.getCachedData
	delete options.lazy
	delete options.transform
	delete options.maxAge
	delete options.getFromCache
	delete options.immediate
	if (options.query) options.query = objectToValue(options.query, 'query')
	if (options.params) options.params = objectToValue(options.params, 'params')
	if (options.body) options.body = objectToValue(options.body, 'body')

	try {
		let got
		if (process.client) got = await $fetch(url, options)
		else got = await useRequestFetch()(url, options)

		if (opts.transform) {
			if (typeof opts.transform !== 'function') throw Error(`[transform] must be a function`)
			got = opts.transform(got)
		}
		saveTimeHistory(key, payload)
		payload.data[key] = got

		if (!isSameKey(opts, key, url)) return

		data.value = got
		pending.value = false
	} catch (e) {
		const err = createError(e)

		if (!isSameKey(opts, key, url)) return

		error.value = err
		if (process.server) payload._errors[key] = err // do not store Error in client
		pending.value = false
	}
}

async function mainAsyncData(handler, opts, data, pending, error, key, payload) {
	try {
		let got = await handler()

		if (opts.transform) {
			if (typeof opts.transform !== 'function') throw Error(`[transform] must be a function`)
			got = opts.transform(got)
		}
		saveTimeHistory(key, payload)
		payload.data[key] = got

		if (!isSameKey(opts, key)) return

		data.value = got
		pending.value = false
	} catch (e) {
		const err = createError(e)

		if (!isSameKey(opts, key)) return

		error.value = err
		if (process.server) payload._errors[key] = err // do not store Error in client
		pending.value = false
	}
}

function getKey(options, url) {
	const key = options.key

	if (typeof key === 'string') {
		if (key.length === 0) throw Error(`[key] can't be an empty string`)
		return key
	}

	if (isRef(key)) {
		const k = key.value
		if (typeof k !== 'string') throw Error(`The value of reactive [key] must be a string`)
		if (k.length === 0) throw Error(`The value of reactive [key] can't be an empty string`)
		return k
	}

	if (url) {
		if (options.query) return hash([url, objectToValue(options.query, 'query'), (options.method || 'GET').toUpperCase()])
		return hash([url, (options.method || 'GET').toUpperCase()])
	}

	throw Error(`[key] must be a string or a reactive string value.`)
}

function objectToValue(obj, type) {
	if (Object.prototype.toString.call(obj) !== '[object Object]') throw Error(`[${type}] must be object`)
	const newObj = {}
	Object.keys(obj).forEach(el => {
		newObj[el] = toValue(obj[el])
	})
	return newObj
}

function saveTimeHistory(key, payload) {
	if (process.server) return
	if (!payload.dataTimeHistory) payload.dataTimeHistory = {}
	payload.dataTimeHistory[key] = Date.now()
}

function getTimeHistory(key, payload) {
	if (process.server) return
	if (!payload.dataTimeHistory) payload.dataTimeHistory = {}
	return payload.dataTimeHistory[key]
}

function isSameKey(options, key, url) {
	try {
		const k = getKey(options, url)
		if (k === key) return true
	} catch {
		return false
	}
}
