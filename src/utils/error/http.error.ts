import { Response } from 'express'
import {
  Error,
  ErrorDataReturn,
  HttpResonseError
} from '../../types/error.type'

import { httpResponse } from '../httpResponse'

const errorRes = (
  res: Response,
  name: string,
  status: number,
  error?: Error | Error[]
) => {
  const errorDefault: Error = { msg: name, param: 'server' }

  const data: ErrorDataReturn = {
    name,
    error: error || errorDefault
  }

  return httpResponse(res, status, data)
}

export const ErrorResponse = errorRes

export const NotFoundResponse: HttpResonseError = (res, error) => {
  return errorRes(res, 'Not found', 404, error)
}

export const BadRequestResponse: HttpResonseError = (res, error) => {
  return errorRes(res, 'Bad request', 400, error)
}

export const InternalServerErrorResponse: HttpResonseError = (res, error) => {
  return errorRes(res, 'Internal server error', 500, error)
}

export const UnauthorizedResponse: HttpResonseError = (res, error) => {
  return errorRes(res, 'Unauthorized', 401, error)
}
