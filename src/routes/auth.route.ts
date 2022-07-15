import { Router } from 'express'
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
import {
  createUserSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema
} from '../validator-schema/user.schema'

const router = Router()

router.get('/', autheticate, authUserHandler)

router.get('/logout', autheticate, logoutHandler)

router.get('/verify/:token', verifyHandler)

router.get('/reset-password/:token', resetPasswordPage)

router.post('/reset-password/:token', resetPasswordSchema, resetPasswordHandler)

router.post('/register', createUserSchema, registerHandler)

router.post('/login', loginSchema, loginHandler)

router.post('/send-mail', apiLimiter, sendMailHandler)

router.post('/forgot-password', forgotPasswordSchema, forgotPasswordHandler)

export default router
