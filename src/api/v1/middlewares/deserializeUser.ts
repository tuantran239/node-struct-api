import { NextFunction, Request, Response } from 'express'
import { getSessionExist } from '../services/session.service'
import { verifyJWT, signJWT } from '../utils/jwt'
import { cookieCons, jwtCons } from '@api/constants'

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access
  const refreshToken = req.cookies.refresh

  if (!accessToken) {
    return next()
  }

  const { decode, valid, expired } = verifyJWT(accessToken)

  if (valid) {
    const { error } = await getSessionExist(false, {
      session: decode?.sessionId
    })
    if (error) {
      return next()
    }
    res.locals.user = decode?.userId
    return next()
  }

  if (refreshToken && expired) {
    const { decode, valid } = verifyJWT(refreshToken)
    if (valid) {
      const { error } = await getSessionExist(false, {
        session: decode?.sessionId
      })
      if (error) {
        return next()
      }
      const newAccessToken = signJWT(decode, {
        expiresIn: jwtCons.timeAccessToken
      })
      res.clearCookie('access')
      res.cookie('access', newAccessToken, {
        maxAge: cookieCons.timeCookieAccessToken,
        httpOnly: true
      })
      res.locals.user = decode?.userId
    }
  }

  next()
}
