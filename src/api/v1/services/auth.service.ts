import { AuthType } from '../types'
import User from '../models/User'
import { throwValidationError } from '../error/mongodb-error'
import { FuncHandleService } from '../utils/functions'
import { sendMail } from '../utils/nodemailer'
import { mailConf } from '@config'

export const sendLinkVerify = async (email: string, method: string, token: string, link: string) =>
  FuncHandleService('Error send link verify', async () => {
    const href = `${link}/${token}`
    let title = 'verify Email'
    switch (method) {
      case mailConf.method.register:
        title = 'Active Account'
        break
      case mailConf.method.resetPassword:
        title = 'Reset Password'
        break
    }
    await sendMail(
      { to: email },
      { link: href, title, content: 'Click link below to verify your email' }
    )
    return token
  })

export const authEmailPassword = (email: string, password: string) =>
  FuncHandleService('Error auth email and password', async () => {
    const user = await User.findOne({ email, authType: AuthType.EMAIL }, 'email password active')
    if (!user) {
      throwValidationError('email', 'email not found', true)
    }
    const isMatch = await user?.comparePassword(password)
    if (!isMatch) {
      throwValidationError('password', 'password not match', true)
    }
    if (!user?.active) {
      throwValidationError('email', 'user not active', true)
    }
    return user
  })
