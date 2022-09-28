import { logger } from '@api-v1/utils'
import client from '@api-v1/utils/redis'

export const FuncHandleHGet = async (key: string): Promise<any | undefined> => {
  try {
    const dataJson = await client.hGet(key, key)
    return dataJson ? JSON.parse(dataJson) : undefined
  } catch (error) {
    return undefined
  }
}

export const FuncHandleHSet = async (
  key: string,
  field: any,
  expire: number = 3600
): Promise<void> => {
  try {
    await client.hSet(key, key, JSON.stringify(field))
    await client.expire(key, expire)
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error hSetAuth')
  }
}

export const FuncHandleHRemove = async (key: string): Promise<void> => {
  try {
    await client.hSet(key, key, JSON.stringify(null))
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error hSetRemove')
  }
}

export const FuncHandleGet = async (key: string): Promise<any | undefined> => {
  try {
    const dataJson = await client.get(key)
    return dataJson ? JSON.parse(dataJson) : undefined
  } catch (error) {
    return undefined
  }
}

export const FuncHandleSet = async (
  key: string,
  field: any,
  expire: number = 3600
): Promise<any | undefined> => {
  try {
    const dataJson = await client.set(key, JSON.stringify(field))
    await client.expire(key, expire)
    return dataJson ? JSON.parse(dataJson) : undefined
  } catch (error) {
    return undefined
  }
}
