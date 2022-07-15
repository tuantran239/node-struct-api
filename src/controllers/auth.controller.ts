import { Request, Response } from 'express'
import jwt from '../config/jwt'
import mail from '../config/mail'
import { authEmailPassword, sendLinkVerify } from '../services/auth.service'
import { getRole, getRoleExist } from '../services/role.service'
import { createSession, deleteSession } from '../services/session.service'
import { createUser, getUserExist, updateUser } from '../services/user.service'
import { UserRole } from '../types/user.type'
import { expressValidatorError } from '../utils/error/express-validator-error'
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  NotFoundResponse
} from '../utils/error/http.error'
import { httpResponse } from '../utils/httpResponse'
import { signJWT, verifyJWT } from '../utils/jwt'

export const registerHandler = async (req: Request, res: Response) => {
  const validatorError = expressValidatorError(req, res)
  if (validatorError && validatorError.length > 0) {
    return BadRequestResponse(res, validatorError)
  }

  const role = await getRoleExist(false, { name: UserRole.USER }, '_id')

  if (role.error) {
    return InternalServerErrorResponse(res, role.error.error)
  }

  const body = {
    ...req.body,
    role: role.data?._id,
    avatar: {
      public_id: null,
      url: `https://avatars.dicebear.com/api/jdenticon/${req.body.name}.svg`
    }
  }
  const { error, data: user } = await createUser(body)
  if (error && error.name === 'Internal') {
    return InternalServerErrorResponse(res, error.error)
  } else if (error && error.name === 'Validation') {
    return BadRequestResponse(res, error.error)
  }

  const { data: token } = await sendLinkVerify(
    user?.email as string,
    mail.method.register,
    mail.link.register
  )
  await updateUser({ email: user?.email as string }, { token })

  return httpResponse(res, 200, {
    success: true,
    email: user?.email as string,
    method: mail.method.register
  })
}

export const sendMailHandler = async (req: Request, res: Response) => {
  const { email, method } = req.body

  const { error: errorExist } = await getUserExist(false, { email }, 'email')
  if (errorExist) {
    return NotFoundResponse(res, errorExist.error)
  }

  let link

  switch (method) {
    case mail.method.register:
      link = mail.link.register
      break
    case mail.method.resetPassword:
      link = mail.link.resetPassword
      break
    default:
      return BadRequestResponse(res, { msg: 'Method Invalid', param: 'server' })
  }

  const { error, data: newToken } = await sendLinkVerify(
    email as string,
    method as string,
    link
  )
  if (error) {
    return InternalServerErrorResponse(res, error.error)
  }

  await updateUser({ email }, { token: newToken })

  return httpResponse(res, 200, { success: true })
}

export const verifyHandler = async (req: Request, res: Response) => {
  const { token } = req.params

  const { decode, valid, expired } = verifyJWT(token)

  if (!valid && expired) {
    return BadRequestResponse(res, {
      msg: 'Token expired',
      param: 'server'
    })
  } else if (!valid) {
    return InternalServerErrorResponse(res, {
      msg: 'Error server',
      param: 'server'
    })
  }

  if (!Object.values(mail.method).includes(decode.method as string)) {
    return BadRequestResponse(res, {
      msg: 'Method Invalid',
      param: 'server'
    })
  }

  const { error: errorExist, data: user } = await getUserExist(false, {
    email: decode.email,
    token
  })
  if (errorExist) {
    return NotFoundResponse(res, { msg: 'Token not exist', param: 'server' })
  }

  user!!.active = true
  user!!.token = null
  await user!!.save()
  return httpResponse(res, 200, { success: true })
}

export const loginHandler = async (req: Request, res: Response) => {
  const validatorError = expressValidatorError(req, res)
  if (validatorError && validatorError.length > 0) {
    return BadRequestResponse(res, validatorError)
  }

  const { email, password } = req.body
  const { data: user, error } = await authEmailPassword(email, password)

  if (error && error.name === 'Internal') {
    return InternalServerErrorResponse(res, error.error)
  } else if (error && error.name === 'Validation') {
    return BadRequestResponse(res, error.error)
  }

  await deleteSession({ user: user?._id })
  const { data: session, error: errorSession } = await createSession({
    user: user?._id
  })

  if (errorSession) {
    return InternalServerErrorResponse(res, errorSession.error)
  }

  const objJwt = { userId: user?._id, sessionId: session?._id }

  const accessToken = signJWT(objJwt, { expiresIn: jwt.timeAccessToken })
  const refreshToken = signJWT(objJwt, { expiresIn: jwt.timeRefeshToken })

  res.cookie('access', accessToken, {
    maxAge: jwt.timeAccessToken,
    httpOnly: true
  })

  res.cookie('refresh', refreshToken, {
    maxAge: jwt.timeRefeshToken,
    httpOnly: true
  })

  return httpResponse(res, 200, { success: true })
}

export const authUserHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  return httpResponse(res, 200, { user })
}

export const logoutHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  res.clearCookie('access')
  res.clearCookie('refresh')
  await deleteSession({ user: user._id })
  return httpResponse(res, 200, { success: true })
}

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const validatorError = expressValidatorError(req, res)
  if (validatorError && validatorError.length > 0) {
    return BadRequestResponse(res, validatorError)
  }

  const { email } = req.body
  const { error: errorExist, data: user } = await getUserExist(false, {
    email
  })
  if (errorExist) {
    return NotFoundResponse(res, errorExist.error)
  }
  const { data: token } = await sendLinkVerify(
    user?.email as string,
    mail.method.resetPassword,
    mail.link.resetPassword
  )
  await updateUser({ email: user?.email as string }, { token })
  return httpResponse(res, 200, {
    success: true,
    email: user?.email as string,
    method: mail.method.resetPassword
  })
}

export const resetPasswordPage = async (req: Request, res: Response) => {
  const { token } = req.params

  const { decode, valid, expired } = verifyJWT(token)

  if (!valid && expired) {
    return BadRequestResponse(res, {
      msg: 'Token expired',
      param: 'server'
    })
  } else if (!valid) {
    return InternalServerErrorResponse(res, {
      msg: 'Error server',
      param: 'server'
    })
  }

  if (decode.method !== mail.method.resetPassword) {
    return BadRequestResponse(res, {
      msg: 'Method Invalid',
      param: 'server'
    })
  }

  const { error: errorExist } = await getUserExist(false, {
    email: decode.email,
    token
  })
  if (errorExist) {
    return NotFoundResponse(res, { msg: 'Token not exist', param: 'server' })
  }

  res.render('reset-password.ejs')
}

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const validatorError = expressValidatorError(req, res)
  if (validatorError && validatorError.length > 0) {
    return BadRequestResponse(res, validatorError)
  }

  const { token } = req.params

  const { decode, valid, expired } = verifyJWT(token)

  if (!valid && expired) {
    return BadRequestResponse(res, {
      msg: 'Token expired',
      param: 'server'
    })
  } else if (!valid) {
    return InternalServerErrorResponse(res, {
      msg: 'Error server',
      param: 'server'
    })
  }

  if (decode.method !== mail.method.resetPassword) {
    return BadRequestResponse(res, {
      msg: 'Method Invalid',
      param: 'server'
    })
  }

  const { error: errorExist, data: user } = await getUserExist(false, {
    email: decode.email,
    token
  })
  if (errorExist) {
    return NotFoundResponse(res, { msg: 'Token not exist', param: 'server' })
  }

  const { password } = req.body

  user!!.password = password
  user!!.token = null
  await user!!.save()

  return httpResponse(res, 200, { success: true })
}
