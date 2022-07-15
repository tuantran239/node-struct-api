import { NextFunction, Request, Response } from 'express'
import { getUserExist } from '../services/user.service'
import {
  InternalServerErrorResponse,
  UnauthorizedResponse
} from '../utils/error/http.error'

import { UserRole } from '../types/user.type'

export const autheticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user
  if (!userId) {
    return UnauthorizedResponse(res, { msg: 'unauthorized', param: 'user' })
  }
  const { data: user, error } = await getUserExist(
    false,
    { _id: userId },
    '-password',
    { populate: 'role' }
  )
  if (error) {
    return InternalServerErrorResponse(res, error.error)
  }
  res.locals.user = user
  next()
}

export const authRole =
  (roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user
    if (!roles.includes(user.role.name)) {
      return UnauthorizedResponse(res, {
        msg: 'role not access',
        param: 'user'
      })
    }
    next()
  }
