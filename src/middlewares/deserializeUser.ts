import { NextFunction, Request, Response } from 'express'
import jwt from '../config/jwt'
import { getSessionExist } from '../services/session.service'
import { verifyJWT, signJWT } from '../utils/jwt'

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access
  const refreshToken = req.cookies.refresh

  if (accessToken) {
    const { decode, valid } = verifyJWT(accessToken)
    if (valid) {
      const { error } = await getSessionExist(false, { session: decode?.sessionId })
      if (error) {
        return next()
      }
      res.locals.user = decode?.userId
      return next()
    }
  }

  if (refreshToken) {
    const { decode, valid } = verifyJWT(refreshToken)
    if (valid) {
      const { error } = await getSessionExist(false, { session: decode?.sessionId })
      if (error) {
        return next()
      }
      const newAccessToken = signJWT(decode, {
        expiresIn: jwt.timeAccessToken
      })
      res.cookie('access', newAccessToken, {
        maxAge: jwt.timeAccessToken,
        httpOnly: true
      })
      res.locals.user = decode?.userId
    }
  }

  next()
}

export default deserializeUser
