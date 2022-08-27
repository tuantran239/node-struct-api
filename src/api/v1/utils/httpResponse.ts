import type { Response } from 'express'

export const HttpResponse = (res: Response, status: number, data: any) => {
  return res.status(status).send(data)
}
