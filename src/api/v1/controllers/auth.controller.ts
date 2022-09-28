import { Request, Response } from 'express'
import { serverConf } from '@config'
import { authEmailPassword } from '@api-v1/services/auth.service'
import { createSession, deleteSession } from '@api-v1/services/session.service'
import { createUser, getUserExist, updateUser } from '@api-v1/services/user.service'
import { AuthType } from '@api-v1/types/user.type'
import {
  BadRequestResponse,
  CommonErrorResponse,
  generateError,
  InternalServerErrorResponse,
  NotFoundResponse
} from '@api-v1/error/http-error'
import { HttpResponse, signJWT, verifyJWT, generateAvatarUrl } from '@api-v1/utils'
import { sendMailWorker } from '@api-v1/worker/email-worker'
import { cookieCons, jwtCons, mailCons } from '@api-v1/constants'

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
    { email: user?.email as string, method: mailCons.method.register },
    {
      expiresIn: '1h'
    }
  )
  await sendMailWorker({
    email: user?.email as string,
    method: mailCons.method.register,
    token,
    link: mailCons.link.register
  })
  await updateUser({ email: user?.email as string }, { token })

  return HttpResponse(res, 201, {
    success: true,
    email: user?.email as string,
    method: mailCons.method.register
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
    case mailCons.method.register:
      link = mailCons.link.register
      break
    case mailCons.method.resetPassword:
      link = mailCons.link.resetPassword
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
  await sendMailWorker({
    email: email as string,
    method,
    token: newToken,
    link: link as string
  })
  await updateUser({ email }, { token: newToken })

  return HttpResponse(res, 200, { success: true })
}

export const verifyHandler = async (req: Request, res: Response) => {
  const { token } = req.params
  const { decode, valid, expired } = verifyJWT(token)
  if (!valid && expired) {
    return BadRequestResponse(res, generateError('Token expired', 'server'))
  } else if (!valid) {
    return InternalServerErrorResponse(
      res,
      generateError('Error server', 'server')
    )
  }

  if (!Object.values(mailCons.method).includes(decode.method as string)) {
    return BadRequestResponse(res, generateError('Method Invalid', 'server'))
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

  res.redirect(`${serverConf.clientUrl}/login`)
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
  const accessToken = signJWT(objJwt, { expiresIn: jwtCons.timeAccessToken })
  const refreshToken = signJWT(objJwt, { expiresIn: jwtCons.timeRefeshToken })
  res.cookie('access', accessToken, {
    maxAge: cookieCons.timeCookieAccessToken,
    httpOnly: true
  })
  res.cookie('refresh', refreshToken, {
    maxAge: cookieCons.timeCookieRefeshToken,
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
  const accessToken = signJWT(objJwt, { expiresIn: jwtCons.timeAccessToken })
  const refreshToken = signJWT(objJwt, { expiresIn: jwtCons.timeRefeshToken })
  res.cookie('access', accessToken, {
    maxAge: cookieCons.timeCookieAccessToken,
    httpOnly: true
  })
  res.cookie('refresh', refreshToken, {
    maxAge: cookieCons.timeCookieRefeshToken,
    httpOnly: true
  })

  res.redirect(serverConf.clientUrl)
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
    { email: user?.email as string, method: mailCons.method.resetPassword },
    {
      expiresIn: '1h'
    }
  )
  await sendMailWorker({
    email: user?.email as string,
    method: mailCons.method.resetPassword,
    token,
    link: mailCons.link.resetPassword
  })
  await updateUser({ email: user?.email as string }, { token })

  return HttpResponse(res, 200, {
    success: true,
    email: user?.email as string,
    method: mailCons.method.resetPassword
  })
}

export const resetPasswordPage = async (req: Request, res: Response) => {
  const { token } = req.params
  const { decode, valid, expired } = verifyJWT(token)
  if (!valid && expired) {
    return BadRequestResponse(res, generateError('Token expired', 'server'))
  } else if (!valid) {
    return InternalServerErrorResponse(
      res,
      generateError('Error server', 'server')
    )
  }

  if (decode.method !== mailCons.method.resetPassword) {
    return BadRequestResponse(res, generateError('Method Invalid', 'server'))
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
    return BadRequestResponse(res, generateError('Token expired', 'server'))
  } else if (!valid) {
    return InternalServerErrorResponse(
      res,
      generateError('Error server', 'server')
    )
  }

  if (decode.method !== mailCons.method.resetPassword) {
    return BadRequestResponse(res, generateError('Method Invalid', 'server'))
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

  res.redirect(`${serverConf.clientUrl}/login`)
}
