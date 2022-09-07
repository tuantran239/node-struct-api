import { Router } from 'express'
import {
  updateInfoHandler,
  updatePasswordHandler,
  uploadAvatarHandler
} from '../controllers/user.controller'
import { authenticate, multerSingleFile, validate } from '../middlewares'
import {
  updateInfoSchema,
  updatePasswordSchema
} from '../validator-schema/user.schema'

const router = Router()

router.post('/upload-avatar', authenticate, multerSingleFile('avatar'), uploadAvatarHandler)

router.patch('/update-info',
  authenticate,
  updateInfoSchema,
  validate,
  updateInfoHandler)

router.patch(
  '/update-password',
  authenticate,
  updatePasswordSchema,
  validate,
  updatePasswordHandler
)

export default router
