import { NextFunction, Request, Response } from 'express'
import multer from 'multer'

import { InternalServerErrorResponse } from '../utils/error/http.error'

export const uploadSinge =
  (fileName: string) => (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({ limits: { fileSize: 10000000 } }).single(fileName)
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return InternalServerErrorResponse(res, {
          msg: err.message,
          param: 'multer'
        })
      } else if (err) {
        return InternalServerErrorResponse(res, {
          msg: err.message,
          param: 'multer'
        })
      }
      next()
    })
  }
