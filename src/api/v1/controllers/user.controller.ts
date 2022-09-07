import { Request, Response } from 'express'
import { deleteAvatar, getUserExist, updateUser } from '../services/user.service'
import {
  BadRequestResponse,
  CommonErrorResponse,
  InternalServerErrorResponse,
  generateError
} from '../error/http-error'
import { generateAvatarUrl, HttpResponse } from '../utils'
import { uploadFile } from '@api/services/upload.service'
import { cloudinaryCons } from '@api/constants'

export const uploadAvatarHandler = async (req: Request, res: Response) => {
  const file = req.file
  const user = res.locals.user

  const { error: errorDel } = await deleteAvatar(user?.avatar.public_id)
  if (errorDel) {
    return InternalServerErrorResponse(res, errorDel.error)
  }

  const { error, data: result } = await uploadFile(
    cloudinaryCons.folder('avatar', user?._id),
    file,
    { width: 320, height: 320 }
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  await updateUser(
    { _id: user?._id },
    { avatar: result || { public_id: null, url: generateAvatarUrl(user?.name) } }
  )

  return HttpResponse(res, 200, { success: true })
}

export const updateInfoHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  const { email, name } = req.body

  const { error } = await updateUser({ _id: user?._id }, { email, name })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, { success: true })
}

export const updatePasswordHandler = async (req: Request, res: Response) => {
  const { password, newPassword } = req.body
  const user = res.locals.user

  const { error: errorExist, data: u } = await getUserExist(false, {
    _id: user?._id
  })
  if (errorExist) {
    return CommonErrorResponse(res, errorExist)
  }

  const isMatch = await u?.comparePassword(password)
  if (!isMatch) {
    return BadRequestResponse(res, generateError('Password not match', 'password'))
  }

  u!!.password = newPassword
  await u!!.save()

  return HttpResponse(res, 200, { success: true })
}
