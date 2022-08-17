import 'dotenv/config'

const mongodbUrl = process.env.MONGODB_URL

const dbConf = { mongodbUrl }

export default dbConf
