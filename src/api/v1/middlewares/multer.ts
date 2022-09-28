import { logger } from '@api-v1/utils'
import { NextFunction, Request, Response } from 'express'
import multer from 'multer'

import { generateError, InternalServerErrorResponse } from '../error/http-error'

export const multerSingleFile =
  (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const upload = multer({ limits: { fileSize: 10000000 } }).single(fieldName)
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        logger.error(err.message, 'Error single multer')
        return InternalServerErrorResponse(res, generateError(err.message, 'single multer'))
      } else if (err) {
        logger.error(err.message, 'Error single multer')
        return InternalServerErrorResponse(res, generateError(err.message, 'single multer'))
      }
      next()
    })
  }

export const multerMultiFile =
  (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({ limits: { fileSize: 10000000 } }).array(fieldName)
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        logger.error(err.message, 'Error multi multer')
        return InternalServerErrorResponse(res, generateError(err.message, 'multi multer'))
      } else if (err) {
        logger.error(err.message, 'Error multi multer')
        return InternalServerErrorResponse(res, generateError(err.message, 'multi multer'))
      }
      next()
    })
  }
