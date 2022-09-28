import { Response } from 'express'
import { Error, ErrorResponse, HttpResonseError } from '@api-v1/types'

import { HttpResponse } from '../utils'

const errorRes = (
  res: Response,
  name: string,
  status: number,
  error: Error[]
) => {
  const data: ErrorResponse = {
    name,
    error,
    status
  }
  return HttpResponse(res, status, data)
}

export const generateError = (message: string, field: string) => {
  const error: Error[] = [{ message, field }]
  return error
}

export const CommonErrorResponse = (res: Response, data: ErrorResponse) => {
  return HttpResponse(res, data.status, data)
}

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

export const ForbiddenResponse: HttpResonseError = (res, error) => {
  return errorRes(res, 'Forbidden', 403, error)
}
