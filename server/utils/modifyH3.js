import Ajv from 'ajv'
const ajv = new Ajv()

// add mongodb object format
ajv.addKeyword({
	keyword: 'ValidateByFunction',
	validate: (schema, data) => {
		if (typeof schema !== 'function') return false
		if (!schema(data)) return false
		return true
	},
	error: {
		message: 'ValidateByFunction error'
	}
})

class ModifyH3 {
	#ajvValidate(schema, data) {
		if (!schema) return { error: true, message: 'No schema proviled' }
		let validate = ajv.compile(schema)
		let valid = validate(data)

		if (validate.errors) {
			let path = validate.errors[0].instancePath
			path = path ? `'${path.replace('/', '')}' ` : ''
			return { error: true, message: path + validate.errors[0].message }
		} else if (valid === true) return { error: false }
		else return { error: true, message: 'Some undefined errors have occured' }
	}
	constructor(/**@type {import('h3').H3Event}*/ app) {
		if (!app.cache) {
			app.cache = {
				bodyParsed: false,
				body: undefined,
				formParsed: false,
				form: undefined
			}
		}
		this.req = {
			method: app.method,
			url: getRequestURL(app),
			path: app.path,
			headers: getRequestHeaders(app),
			getHeader: name => getRequestHeader(app, name),
			cookies: parseCookies(app),
			query: getQuery(app),
			params: getRouterParams(app),
			body: app.cache.body,
			form: app.cache.form,
			ip: getRequestHeader(app, 'x-forwarded-for'),
			parseBody: async () => {
				if (!app.cache.bodyParsed) {
					this.req.body = await readBody(app)
					app.cache.bodyParsed = true
					app.cache.body = this.req.body
				}
				return
			},
			parseForm: async () => {
				if (!app.cache.formParsed) {
					const data = await readMultipartFormData(app)
					const obj = {}
					for (const each of data) {
						if (!each.hasOwnProperty('type')) {
							if (!obj.fields) obj.fields = {}
							each.data = each.data.toString('utf-8')

							if (!each.name.endsWith('[]')) obj.fields[each.name] = each.data
							else {
								const name = each.name.slice(0, -2)
								if (!obj.fields[name]) obj.fields[name] = [each.data]
								else obj.fields[name].push(each.data)
							}
						} else {
							if (!obj.files) obj.files = {}
							let name = each.name
							each.buffer = each.data
							delete each.name
							delete each.data

							if (!name.endsWith('[]')) obj.files[name] = each
							else {
								name = name.slice(0, -2)
								if (!obj.files[name]) obj.files[name] = [each]
								else obj.files[name].push(each)
							}
						}
					}
					this.req.form = obj
					app.cache.formParsed = true
					app.cache.form = this.req.form
				}
				return
			},
			getCookie: (/**@type {String}*/ name) => getCookie(app, name),
			validate: (/**@type {Object}*/ schema, data) => this.#ajvValidate(schema, data)
		}
		this.res = {
			setCookie: (/**@type {String}*/ name, /**@type {String}*/ value, /**@type {Parameters<setCookie>[3]}*/ opt) => {
				setCookie(app, name, value, opt)
				return this.res
			},
			deleteCookie: (/**@type {String}*/ name, /**@type {Parameters<setCookie>[3]}*/ opt) => {
				deleteCookie(app, name, opt)
				return this.res
			},
			setStatus: (/**@type {Number}*/ code) => {
				setResponseStatus(app, code)
				return this.res
			},
			setHeader: (/**@type {Parameters<setResponseHeader>[1]}*/ name, /**@type {Parameters<setResponseHeader>[2]}*/ val) => {
				setResponseHeader(app, name, val)
				return this.res
			},
			setHeaders: (/**@type {Parameters<setResponseHeaders>[1]}*/ headers) => {
				setResponseHeaders(app, headers)
				return this.res
			},
			appendHeader: (/**@type {Parameters<appendHeader>[1]}*/ name, /**@type {String}*/ val) => {
				appendResponseHeader(app, name, val)
				return this.res
			},
			appendHeaders: (/**@type {Parameters<appendHeaders>[1]}*/ headers) => {
				appendResponseHeaders(app, headers)
				return this.res
			},
			redirect: (/**@type {String}*/ path) => {
				return sendRedirect(app, path)
			},
			stream: (/**@type {Parameters<sendStream>[1]}*/ data) => {
				return sendStream(app, data)
			},
			send: data => {
				if (typeof data == 'object') {
					data = JSON.stringify(data)
					this.res.setHeader('content-type', 'application/json')
				}
				return send(app, data)
			},
			sendStatus: (/**@type {Number}*/ code) => {
				setResponseStatus(app, code)
				return send(app)
			}
		}
	}
}

export default (/**@type {import('h3').H3Event}*/ app) => new ModifyH3(app)
