import { Response } from 'express'

export const httpResponse = (res: Response, status: number, data: any) => {
  return res.status(status).send(data)
}
