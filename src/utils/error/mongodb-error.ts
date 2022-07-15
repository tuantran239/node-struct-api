import { Error as ErrorMongoose } from 'mongoose'
import { Error, ErrorDataReturn } from '../../types/error.type'

export const throwValidationError = (
  path: string,
  errorMessage: string,
  valid: boolean
) => {
  if (valid) {
    const error = new ErrorMongoose.ValidationError()
    error.errors[path] = new ErrorMongoose.ValidatorError({
      message: errorMessage,
      path
    })
    throw error
  }
}

type HandleValidationError = (error: any) => ErrorDataReturn

export const handleValidationError: HandleValidationError = (error) => {
  const errors: Error[] = []
  if (error.name === 'ValidationError') {
    for (const property in error.errors) {
      if (error.errors[property].kind === 'unique') {
        continue
      }
      errors.push({
        param: property,
        msg: error.errors[property].message
      })
    }
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    const property = Object.keys(error.keyPattern)[0]
    errors.push({
      param: property,
      msg: `${property} is already taken`
    })
  } else {
    const errorReturn: ErrorDataReturn = {
      name: 'Internal',
      error: {
        param: 'server',
        msg: error.message
      }
    }
    return errorReturn
  }
  const errorReturn: ErrorDataReturn = { name: 'Validation', error: errors }
  return errorReturn
}
