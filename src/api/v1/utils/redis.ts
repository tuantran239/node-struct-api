import { redisConf } from '@config'
import { createClient, RedisClientType } from 'redis'
import logger from './logger'

const client: RedisClientType = createClient({
  socket: {
    host: redisConf.host,
    port: redisConf.port
  }
})

export const connect = async () => {
  try {
    await client.connect()
    logger.info('Connected to redis client')
  } catch (err: any) {
    logger.error({ error: err.message }, 'Error connect redis client')
  }
}

export default client
