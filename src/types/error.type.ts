import { Response } from 'express'

export type Error = {
  msg: string
  param: string
  location?: string
}

export type HttpResonseError = (res: Response, error?: Error | Error[]) => any

export type ErrorDataReturn = {
  name: string
  error: Error | Error[]
}
