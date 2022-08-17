import { sign, verify, SignOptions } from 'jsonwebtoken'
import jwtConf from '../config/jwt'

export const signJWT = (object: Object, options?: SignOptions) => {
  return sign({ decode: object }, jwtConf.jwtSecect as string, {
    ...options
  })
}

export const verifyJWT = (token: string) => {
  try {
    const { decode } = <any>verify(token, jwtConf.jwtSecect as string)
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
