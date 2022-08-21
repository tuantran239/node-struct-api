import { Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import { ErrorResponse } from '../types/error.type'
import { CommonErrorResponse, generateError } from '../error/http-error'

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
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
