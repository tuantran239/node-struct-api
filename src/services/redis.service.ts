import { createClient, RedisClientType } from 'redis'
import redisConf from '../config/redis'
import { FunctionHandleHGet, FunctionHandleHSet } from '../utils/functions/functionRedis'
import { authKey } from '../utils/keys'

const client: RedisClientType = createClient({
    socket: {
        host: redisConf.host,
        port: redisConf.port
    }
})

export const hSetAuth = async (userId: string, field: any) => FunctionHandleHSet(client, authKey(userId), field)

export const hGetAuth = async (userId: string) => FunctionHandleHGet(client, authKey(userId))
