import { Request, Response, Router } from 'express'
import passport from 'passport'
import { loginSocialHandler } from '../controllers/auth.controller'
import { generateError, UnauthorizedResponse } from '../error/http.error'

const router = Router()

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/passport/failure' }),
  loginSocialHandler
)

router.get('/auth/failure', function (req: Request, res: Response) {
  return UnauthorizedResponse(res, generateError('Unauthorized', 'server'))
})

export default router
