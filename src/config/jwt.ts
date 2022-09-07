import 'dotenv/config'

const jwtSecect = process.env.JWT_SECRET || 'secret'

const jwtConf = { jwtSecect }

export default jwtConf
