import { sign, verify, SignOptions } from 'jsonwebtoken'
import jwt from '../config/jwt'

export const signJWT = (object: Object, options?: SignOptions) => {
  return sign({ decode: object }, jwt.jwtSecect as string, {
    ...options
  })
}

export const verifyJWT = (token: string) => {
  try {
    const { decode } = <any>verify(token, jwt.jwtSecect as string)
    return {
      valid: true,
      expired: false,
      decode
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decode: null
    }
  }
}
