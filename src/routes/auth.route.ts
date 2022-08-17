import { Request, Response, Router } from 'express'
import passport from 'passport'
import {
  authUserHandler,
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  registerHandler,
  resetPasswordHandler,
  resetPasswordPage,
  sendMailHandler,
  verifyHandler
} from '../controllers/auth.controller'
import { autheticate } from '../middlewares/authenticate'
import { apiLimiter } from '../middlewares/rate-limt'
import validate from '../middlewares/validate'
import {
  createUserSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema
} from '../validator-schema/user.schema'

const router = Router()

router.get('/hi', (req: Request, res: Response) => {
  res.send('hi')
})

router.get('/', autheticate, authUserHandler)

router.get('/logout', autheticate, logoutHandler)

router.get('/verify/:token', verifyHandler)

router.get('/reset-password/:token', resetPasswordPage)

router.post('/reset-password/:token', resetPasswordSchema, validate, resetPasswordHandler)

router.post('/register', createUserSchema, validate, registerHandler)

router.post('/login', loginSchema, validate, loginHandler)

router.post('/send-mail', apiLimiter, validate, sendMailHandler)

router.post('/forgot-password', forgotPasswordSchema, validate, forgotPasswordHandler)

export default router
