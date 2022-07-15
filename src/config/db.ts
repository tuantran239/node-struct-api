require('dotenv').config()

const mongodbUrl = process.env.MONGODB_URL

const db = { mongodbUrl }

export default db
