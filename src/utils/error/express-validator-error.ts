import { Request, Response } from 'express'
import { Error } from '../../types/error.type'

const { validationResult } = require('express-validator')

export const expressValidatorError = (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (errors) {
    return errors.array() as Error[]
  }
  return null
}
