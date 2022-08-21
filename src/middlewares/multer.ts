import { NextFunction, Request, Response } from 'express'
import multer from 'multer'

import { generateError, InternalServerErrorResponse } from '../error/http-error'

export const uploadSinge =
  (fileName: string) => (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({ limits: { fileSize: 10000000 } }).single(fileName)
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return InternalServerErrorResponse(res, generateError(
          err.message,
          'multer'
        ))
      } else if (err) {
        return InternalServerErrorResponse(res, generateError(
          err.message,
          'multer'
        ))
      }
      next()
    })
  }
