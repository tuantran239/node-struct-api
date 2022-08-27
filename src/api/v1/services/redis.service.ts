import { redisConf } from '../../../config'
import { createClient, RedisClientType } from 'redis'
import { FuncHandleHGet, FuncHandleHSet } from '../utils/functions/functionRedis'
import { RedisKeys } from '../utils/keys'

const client: RedisClientType = createClient({
  socket: {
    host: redisConf.host,
    port: redisConf.port
  }
})

const { authKey } = RedisKeys

export const hSetAuth = async (userId: string, field: any) =>
  FuncHandleHSet(client, authKey(userId), field)

export const hGetAuth = async (userId: string) => FuncHandleHGet(client, authKey(userId))
