import type { ErrorResponse } from '@api-v1/types'
import { handleValidationError } from '@api-v1/error/mongodb-error'
import { logger } from '@api-v1/utils'

export interface Return<T> {
  data: T
  error: ErrorResponse
}

export const FuncHandleService = async <T>(
  log: string,
  handle: () => Promise<T>
): Promise<Partial<Return<T>>> => {
  try {
    const data = await handle()
    return { data }
  } catch (err) {
    const error = handleValidationError(err)
    logger.error({ error }, log)
    return { error }
  }
}
