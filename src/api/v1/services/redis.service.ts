import { FuncHandleHGet, FuncHandleHSet } from '@api-v1/utils/functions/functionRedis'
import { RedisKeys } from '@api-v1/utils/keys'

const { authKey } = RedisKeys

export const hSetAuth = async (userId: string, field: any) =>
  FuncHandleHSet(authKey(userId), field)

export const hGetAuth = async (userId: string) => FuncHandleHGet(authKey(userId))
