import { checkSchema } from 'express-validator'
import { required, valid } from '@api/error/validator-error-message'

export const createProductSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: required('name')
    }
  },
  gender: {
    notEmpty: {
      errorMessage: required('gender')
    }
  },
  description: {
    notEmpty: {
      errorMessage: required('description')
    }
  },
  price: {
    notEmpty: {
      errorMessage: required('description')
    },
    isNumeric: {
      errorMessage: valid('price', 'price must be a number')
    }
  }
})
