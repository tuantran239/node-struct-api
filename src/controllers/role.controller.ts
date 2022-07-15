import { Request, Response } from 'express'
import { createRole } from '../services/role.service'
import {
  BadRequestResponse,
  InternalServerErrorResponse
} from '../utils/error/http.error'
import { httpResponse } from '../utils/httpResponse'

export const createRoleHandler = async (req: Request, res: Response) => {
  const { error } = await createRole(req.body)

  if (error && error.name === 'Internal') {
    return InternalServerErrorResponse(res, error.error)
  } else if (error && error.name === 'Validation') {
    return BadRequestResponse(res, error.error)
  }

  return httpResponse(res, 201, { success: true })
}
