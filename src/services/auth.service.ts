import User from '../models/User'
import { AuthType } from '../types/user.type'
import { throwValidationError } from '../error/mongodb-error'
import { FuncHandleService } from '../utils/funcService'
import { sendMail } from '../utils/nodemailer'

export const sendLinkVerify = async (
  email: string,
  token: string,
  link: string
) =>
  FuncHandleService('Error send link verify', async () => {
    const href = `${link}/${token}`
    await sendMail({ to: email }, { link: href, title: 'Verify Email', content: 'Click link below to verify your email' })
    return token
  })

export const checkLinkVerify = () =>
  FuncHandleService('Error send link verify', async () => {
    return null
  })

export const authEmailPassword = (email: string, password: string) =>
  FuncHandleService('Error auth email and password', async () => {
    const user = await User.findOne({ email, authType: AuthType.EMAIL }, 'email password active')
    if (!user) {
      throwValidationError('email', 'email not found', true)
    }

    if (!user?.active) {
      throwValidationError('email', 'user not active', true)
    }

    const isMatch = await user?.comparePassword(password)
    if (!isMatch) {
      throwValidationError('password', 'password not match', true)
    }
    return user
  })
