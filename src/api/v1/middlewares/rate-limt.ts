import { Request, Response } from 'express'
import { ErrorResponse } from '@api-v1/types'
import rateLimit from 'express-rate-limit'
import { CommonErrorResponse, generateError } from '@api-v1/error/http-error'

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req: Request, res: Response) {
    const data: ErrorResponse = {
      name: 'Too Many Requests',
      error: generateError(
        'Too Many Requests',
        'server'
      ),
      status: 429
    }
    return CommonErrorResponse(res, data)
  }
})
