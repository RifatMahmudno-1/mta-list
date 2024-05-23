import { readFileSync, writeFileSync, statSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const dir = useRuntimeConfig().kvdbDir
export default class {
	/**
	 * @param {String} key
	 * @returns {null|String}
	 */
	static getItem(key) {
		if (typeof key !== 'string') throw Error('[key] must be string')

		const path = join(dir, encodeURIComponent(key))
		if (!existsSync(path) || !statSync(path).isFile) return null
		return readFileSync(path, { encoding: 'utf-8' })
	}

	/**
	 * @param {String} key
	 * @param {String} value
	 */
	static setItem(key, value) {
		if (typeof key !== 'string') throw Error('[key] must be string')
		if (typeof value !== 'string') throw Error('[value] must be string')

		if (!existsSync(dir) || !statSync(dir).isDirectory) mkdirSync(dir, { recursive: true })

		const path = join(dir, encodeURIComponent(key))
		writeFileSync(path, value)
	}
}
