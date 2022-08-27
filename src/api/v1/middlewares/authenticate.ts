import { NextFunction, Request, Response } from 'express'
import { getUserExist } from '../services/user.service'
import {
  generateError,
  InternalServerErrorResponse,
  UnauthorizedResponse
} from '../error/http-error'
import { hGetAuth, hSetAuth } from '../services/redis.service'

export const autheticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user
  if (!userId) {
    return UnauthorizedResponse(res, generateError('unauthorized', 'user'))
  }

  let user: any | null = null
  const userJson = await hGetAuth(userId)

  if (userJson) {
    user = userJson
  } else {
    const { data, error } = await getUserExist(
      false,
      { _id: userId },
      '-password -token'
    )
    if (error) {
      return InternalServerErrorResponse(res, error.error)
    } else {
      user = data!
      await hSetAuth(userId, user)
    }
  }
  if (user && !user.active) {
    return UnauthorizedResponse(res, generateError(
      'account not active',
      'user'
    ))
  }
  res.locals.user = user
  next()
}
