import { Request, Response, Router } from 'express'
import {
  authUserHandler,
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  signupHandler,
  resetPasswordHandler,
  resetPasswordPage,
  sendMailHandler,
  verifyHandler
} from '@api-v1/controllers/auth.controller'
import { authenticate, apiLimiter, validate } from '@api-v1/middlewares'
import {
  createUserSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema
} from '@api-v1/validator-schema/user.schema'

const router = Router()

router.get('/hi', (req: Request, res: Response) => {
  res.send('hi')
})

router.get('/', authenticate, authUserHandler)

router.get('/logout', authenticate, logoutHandler)

router.get('/verify/:token', verifyHandler)

router.get('/reset-password/:token', resetPasswordPage)

router.post('/reset-password/:token', resetPasswordSchema, validate, resetPasswordHandler)

router.post('/signup', createUserSchema, validate, signupHandler)

router.post('/login', loginSchema, validate, loginHandler)

router.post('/send-mail', apiLimiter, validate, sendMailHandler)

router.post('/forgot-password', forgotPasswordSchema, validate, forgotPasswordHandler)

export default router
