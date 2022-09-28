import { NextFunction, Request, Response } from 'express'
import { getUserExist } from '@api-v1/services/user.service'
import {
  generateError,
  InternalServerErrorResponse,
  UnauthorizedResponse
} from '@api-v1/error/http-error'
import { hGetAuth, hSetAuth } from '@api-v1/services/redis.service'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user
  if (!userId) {
    return UnauthorizedResponse(res, generateError('unauthorized', 'user'))
  }

  const userJson = await hGetAuth(userId)
  if (userJson) {
    res.locals.user = userJson
    return next()
  }

  const { data: user, error } = await getUserExist(
    false,
    { _id: userId },
    '-password -token'
  )
  if (error) {
    return InternalServerErrorResponse(res, error.error)
  }

  if (!user?.active) {
    return UnauthorizedResponse(
      res,
      generateError('account not active', 'user')
    )
  }
  await hSetAuth(userId, user)
  res.locals.user = user
  next()
}
