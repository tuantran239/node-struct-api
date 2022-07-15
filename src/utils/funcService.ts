import { ErrorDataReturn } from '../types/error.type'

const { handleValidationError } = require('./error/mongodb-error')
const logger = require('./logger')

export interface Return<T> {
  data: T
  error: ErrorDataReturn
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
    // logger.error({ error }, log)
    return { error }
  }
}
