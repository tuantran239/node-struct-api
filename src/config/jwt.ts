import 'dotenv/config'

const jwtSecect = process.env.JWT_SECRET

const timeRefeshToken = '60m'

const timeAccessToken = '1m'

const jwtConf = { jwtSecect, timeAccessToken, timeRefeshToken }

export default jwtConf
