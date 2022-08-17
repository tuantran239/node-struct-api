import User from '../models/User'
import { AuthType } from '../types/user.type'
import { throwValidationError } from '../error/mongodb-error'
import { FuncHandleService } from '../utils/funcService'
import { signJWT } from '../utils/jwt'
import { sendMail } from '../utils/nodemailer'

export const sendLinkVerify = async (
  email: string,
  method: string,
  link: string
) =>
  FuncHandleService('Error send link verify', async () => {
    const token = signJWT(
      { email, method },
      {
        expiresIn: 60 * 60 * 1000
      }
    )
    const href = `${link}/${token}`
    await sendMail({ to: email, html: `<a href=${href}>${href}</a>` })
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
