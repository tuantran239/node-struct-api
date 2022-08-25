import { RedisClientType } from 'redis'
import logger from '../logger'

export const FunctionHandleHGet = async (client: RedisClientType, key: string): Promise<any | undefined> => {
    try {
        await client.connect()
        const dataJson = await client.hGet(key, key)
        await client.disconnect()
        return dataJson ? JSON.parse(dataJson) : undefined
    } catch (error: any) {
        await client.disconnect()
        return undefined
    }
}

export const FunctionHandleHSet = async (client: RedisClientType, key: string, field: any): Promise<void> => {
    try {
        await client.connect()
        await client.hSet(key, key, JSON.stringify(field))
        await client.disconnect()
    } catch (error: any) {
        await client.disconnect()
        logger.error({ error: error.message }, 'Error hSetAuth')
    }
}
