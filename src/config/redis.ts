import 'dotenv/config'

const port = parseInt(process.env.REDIS_PORT as string) || 6379

const host = process.env.REDIS_HOST || 'redis'

const redisConf = {
  host,
  port
}

export default redisConf
