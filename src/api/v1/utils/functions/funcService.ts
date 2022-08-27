import type { ErrorResponse } from '../../types'
import { handleValidationError } from '../../error/mongodb-error'
import logger from '../logger'

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
