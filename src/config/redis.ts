require('dotenv').config()

const redisUrl = process.env.REDIS_URL

const redis = {
  redisUrl
}

export default redis
