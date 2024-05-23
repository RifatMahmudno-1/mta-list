import { MongoClient, ObjectId } from 'mongodb'

class MongoDB {
	static #connecting = false
	static connected = false
	static ObjectId = ObjectId
	static async init() {
		try {
			if (this.#connecting) {
				return new Promise(res => {
					const intID = setInterval(() => {
						if (!mongo.#connecting) {
							clearInterval(intID)
							res()
						}
					}, 20)
				})
			}

			this.#connecting = true
			this.client = await new MongoClient(process.env.MongoUrl).connect()
			this.connected = true
			console.log('Connected to MongoDB')
		} catch {
			console.log('Errors have occured while trying to connect with MongoDB')
		} finally {
			this.#connecting = false
		}
	}
}

export default MongoDB
