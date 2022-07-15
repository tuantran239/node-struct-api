import { TimeSeriesReducers } from '@redis/time-series/dist/commands'
import { Request, Response } from 'express'
import cloudinary from '../config/cloudinary'
import {
  deleteAvatar,
  getUserExist,
  updateUser,
  uploadAvatar
} from '../services/user.service'
import { expressValidatorError } from '../utils/error/express-validator-error'
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  NotFoundResponse
} from '../utils/error/http.error'
import { httpResponse } from '../utils/httpResponse'

export const uploadAvatarHandler = async (req: Request, res: Response) => {
  const file = req.file
  const user = res.locals.user

  const { error: errorDel } = await deleteAvatar(user?.avatar.public_id)

  if (errorDel) {
    return InternalServerErrorResponse(res, errorDel.error)
  }

  const { error, data: result } = await uploadAvatar(
    file!!,
    cloudinary.folder('avatar', user?.id)
  )
  if (error && error.name === 'Internal') {
    return InternalServerErrorResponse(res, error.error)
  } else if (error && error.name === 'Validation') {
    return BadRequestResponse(res, error.error)
  }

  await updateUser(
    { _id: user?.id },
    { avatar: { public_id: result?.public_id, url: result?.url } }
  )
  return httpResponse(res, 200, { success: true })
}

export const updateInfoHandler = async (req: Request, res: Response) => {
  const validatorError = expressValidatorError(req, res)
  if (validatorError && validatorError.length > 0) {
    return BadRequestResponse(res, validatorError)
  }

  const user = res.locals.user

  const { email, name } = req.body

  const { error } = await updateUser({ _id: user?._id }, { email, name })

  if (error && error.name === 'Internal') {
    return InternalServerErrorResponse(res, error.error)
  } else if (error && error.name === 'Validation') {
    return BadRequestResponse(res, error.error)
  }

  return httpResponse(res, 200, { success: true })
}

export const updatePasswordHandler = async (req: Request, res: Response) => {
  const validatorError = expressValidatorError(req, res)
  if (validatorError && validatorError.length > 0) {
    return BadRequestResponse(res, validatorError)
  }

  const { password, newPassword } = req.body
  const user = res.locals.user

  const { error: errorExist, data: u } = await getUserExist(false, {
    _id: user?._id
  })
  if (errorExist) {
    return NotFoundResponse(res, errorExist.error)
  }

  const isMatch = await u?.comparePassword(password)

  if (!isMatch) {
    return BadRequestResponse(res, {
      msg: 'Password not match',
      param: 'password'
    })
  }

  u!!.password = newPassword
  await u!!.save()

  return httpResponse(res, 200, { success: true })
}
