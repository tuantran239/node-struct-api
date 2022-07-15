import { Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import { httpResponse } from '../utils/httpResponse'
import { ErrorDataReturn } from '../types/error.type'

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req: Request, res: Response) {
    const data: ErrorDataReturn = {
      name: 'Too Many Requests',
      error: {
        msg: 'Too Many Requests',
        param: 'server'
      }
    }
    return httpResponse(res, 429, data)
  }
})
