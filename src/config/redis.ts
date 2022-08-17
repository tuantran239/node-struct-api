import 'dotenv/config'

const redisPort = process.env.REDIS_PORT

const redisHost = process.env.REDIS_HOST

const redisConf = {
  redisPort,
  redisHost
}

export default redisConf
