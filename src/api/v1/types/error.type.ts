import type { Response } from 'express'

export type Error = {
  message: string
  field: string
}

export type HttpResonseError = (res: Response, error: Error[]) => any

export type ErrorResponse = {
  name: string
  error: Error[]
  status: number
}
