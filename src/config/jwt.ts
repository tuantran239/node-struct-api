require('dotenv').config()

const jwtSecect = process.env.JWT_SECRET

const timeRefeshToken = 60 * 60000

const timeAccessToken = 1 * 60000

const jwt = { jwtSecect, timeAccessToken, timeRefeshToken }

export default jwt
