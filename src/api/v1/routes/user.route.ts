import { Router } from 'express'
import {
  updateInfoHandler,
  updatePasswordHandler,
  uploadAvatarHandler
} from '../controllers/user.controller'
import { autheticate } from '../middlewares/authenticate'
import { uploadSingeFile, validate } from '../middlewares'
import {
  updateInfoSchema,
  updatePasswordSchema
} from '../validator-schema/user.schema'

const router = Router()

router.post(
  '/upload-avatar',
  autheticate,
  uploadSingeFile('avatar'),
  uploadAvatarHandler
)

router.patch('/update-info',
  autheticate,
  updateInfoSchema,
  validate,
  updateInfoHandler)

router.patch(
  '/update-password',
  autheticate,
  updatePasswordSchema,
  validate,
  updatePasswordHandler
)

export default router
