import { Request, Response } from 'express'
import { jwtConf, mailConf, cookieConf } from '@config'
import { authEmailPassword } from '../services/auth.service'
import { createSession, deleteSession } from '../services/session.service'
import { createUser, getUserExist, updateUser } from '../services/user.service'
import { AuthType } from '../types/user.type'
import {
  BadRequestResponse,
  CommonErrorResponse,
  generateError,
  InternalServerErrorResponse,
  NotFoundResponse
} from '../error/http-error'
import { HttpResponse, signJWT, verifyJWT, generateAvatarUrl } from '../utils'
import { sendMailWorker } from '../worker/email-worker'


export const signupHandler = async (req: Request, res: Response) => {
  const { error: errorExist } = await getUserExist(
    true,
    { email: req.body.email, authType: AuthType.EMAIL },
    'email'
  )
  if (errorExist) {
    return CommonErrorResponse(res, errorExist)
  }

  const body = {
    ...req.body,
    avatar: {
      public_id: null,
      url: generateAvatarUrl(req.body.name)
    }
  }
  const { error, data: user } = await createUser(body)
  if (error) {
    return CommonErrorResponse(res, error)
  }

  const token = signJWT(
    { email: user?.email as string, method: mailConf.method.register },
    {
      expiresIn: '1h'
    }
  )
  await sendMailWorker({ email: user?.email as string, method: mailConf.method.register, token, link: mailConf.link.register })
  await updateUser({ email: user?.email as string }, { token })

  return HttpResponse(res, 201, {
    success: true,
    email: user?.email as string,
    method: mailConf.method.register
  })
}


export const sendMailHandler = async (req: Request, res: Response) => {
  const { email, method } = req.body
  const { error: errorExist } = await getUserExist(
    false,
    { email, authType: AuthType.EMAIL },
    'email'
  )
  if (errorExist) {
    return CommonErrorResponse(res, errorExist)
  }

  let link: string = ''
  switch (method) {
    case mailConf.method.register:
      link = mailConf.link.register
      break
    case mailConf.method.resetPassword:
      link = mailConf.link.resetPassword
      break
    default:
      return BadRequestResponse(res, generateError('Method Invalid', 'server'))
  }

  const newToken = signJWT(
    { email: email as string, method: method as string },
    {
      expiresIn: '1h'
    }
  )
  await sendMailWorker({ email: email as string, method, token: newToken, link: link as string })
  await updateUser({ email }, { token: newToken })

  return HttpResponse(res, 200, { success: true })
}


export const verifyHandler = async (req: Request, res: Response) => {
  const { token } = req.params
  const { decode, valid, expired } = verifyJWT(token)
  if (!valid && expired) {
    return BadRequestResponse(res, generateError('Token expired', 'server'))
  } else if (!valid) {
    return InternalServerErrorResponse(res, generateError(
      'Error server',
      'server'
    ))
  }

  if (!Object.values(mailConf.method).includes(decode.method as string)) {
    return BadRequestResponse(res, generateError(
      'Method Invalid',
      'server'
    ))
  }

  const { error: errorExist, data: user } = await getUserExist(false, {
    email: decode.email,
    token
  })
  if (errorExist) {
    return NotFoundResponse(res, generateError('Token not exist', 'server'))
  }

  user!!.active = true
  user!!.token = null
  await user!!.save()

  return HttpResponse(res, 200, { success: true })
}


export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const { data: user, error } = await authEmailPassword(email, password)
  if (error) {
    return CommonErrorResponse(res, error)
  }

  await deleteSession({ user: user?._id })
  const { data: session, error: errorSession } = await createSession({
    user: user?._id
  })
  if (errorSession) {
    return InternalServerErrorResponse(res, errorSession.error)
  }

  const objJwt = { userId: user?._id, sessionId: session?._id }
  const accessToken = signJWT(objJwt, { expiresIn: jwtConf.timeAccessToken })
  const refreshToken = signJWT(objJwt, { expiresIn: jwtConf.timeRefeshToken })
  res.cookie('access', accessToken, {
    maxAge: cookieConf.timeCookieAccessToken,
    httpOnly: true
  })
  res.cookie('refresh', refreshToken, {
    maxAge: cookieConf.timeCookieRefeshToken,
    httpOnly: true
  })

  return HttpResponse(res, 200, { success: true })
}


export const loginSocialHandler = async (req: any, res: Response) => {
  const user = req.user

  await deleteSession({ user: user?._id })
  const { data: session, error: errorSession } = await createSession({
    user: user?._id
  })
  if (errorSession) {
    return InternalServerErrorResponse(res, errorSession.error)
  }

  const objJwt = { userId: user?._id, sessionId: session?._id }
  const accessToken = signJWT(objJwt, { expiresIn: jwtConf.timeAccessToken })
  const refreshToken = signJWT(objJwt, { expiresIn: jwtConf.timeRefeshToken })
  res.cookie('access', accessToken, {
    maxAge: cookieConf.timeCookieAccessToken,
    httpOnly: true
  })
  res.cookie('refresh', refreshToken, {
    maxAge: cookieConf.timeCookieRefeshToken,
    httpOnly: true
  })

  return HttpResponse(res, 200, { success: true })
}


export const authUserHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  return HttpResponse(res, 200, { user })
}


export const logoutHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  res.clearCookie('access')
  res.clearCookie('refresh')
  await deleteSession({ user: user._id })
  return HttpResponse(res, 200, { success: true })
}


export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { email } = req.body
  const { error: errorExist, data: user } = await getUserExist(false, {
    email,
    authType: AuthType.EMAIL
  })
  if (errorExist) {
    return BadRequestResponse(res, errorExist.error)
  }

  const token = signJWT(
    { email: user?.email as string, method: mailConf.method.resetPassword },
    {
      expiresIn: '1h'
    }
  )
  await sendMailWorker({ email: user?.email as string, method: mailConf.method.resetPassword, token, link: mailConf.link.resetPassword })
  await updateUser({ email: user?.email as string }, { token })

  return HttpResponse(res, 200, {
    success: true,
    email: user?.email as string,
    method: mailConf.method.resetPassword
  })
}


export const resetPasswordPage = async (req: Request, res: Response) => {
  const { token } = req.params
  const { decode, valid, expired } = verifyJWT(token)
  if (!valid && expired) {
    return BadRequestResponse(res, generateError(
      'Token expired',
      'server'
    ))
  } else if (!valid) {
    return InternalServerErrorResponse(res, generateError(
      'Error server',
      'server'
    ))
  }

  if (decode.method !== mailConf.method.resetPassword) {
    return BadRequestResponse(res, generateError(
      'Method Invalid',
      'server'
    ))
  }

  const { error: errorExist } = await getUserExist(false, {
    email: decode.email,
    token
  })
  if (errorExist) {
    return NotFoundResponse(res, generateError('Token not exist', 'server'))
  }

  res.render('reset-password.ejs')
}


export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { token } = req.params
  const { decode, valid, expired } = verifyJWT(token)
  if (!valid && expired) {
    return BadRequestResponse(res, generateError(
      'Token expired',
      'server'
    ))
  } else if (!valid) {
    return InternalServerErrorResponse(res, generateError(
      'Error server',
      'server'
    ))
  }

  if (decode.method !== mailConf.method.resetPassword) {
    return BadRequestResponse(res, generateError(
      'Method Invalid',
      'server'
    ))
  }

  const { error: errorExist, data: user } = await getUserExist(false, {
    email: decode.email,
    token
  })
  if (errorExist) {
    return NotFoundResponse(res, generateError('Token not exist', 'server'))
  }

  const { password } = req.body
  user!!.password = password
  user!!.token = null
  await user!!.save()

  return HttpResponse(res, 200, { success: true })
}
