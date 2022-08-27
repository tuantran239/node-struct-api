import { checkSchema } from 'express-validator'
import {
  minLength,
  required,
  valid
} from '../error/validator-error-message'

export const createUserSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: required('name')
    }
  },
  email: {
    notEmpty: {
      errorMessage: required('email')
    },
    isEmail: {
      errorMessage: valid('email')
    }
  },
  password: {
    notEmpty: {
      errorMessage: required('password')
    },
    isLength: {
      errorMessage: minLength('password', 6),
      options: { min: 6 }
    }
  }
})

export const loginSchema = checkSchema({
  email: {
    notEmpty: {
      errorMessage: required('email')
    },
    isEmail: {
      errorMessage: valid('email')
    }
  },
  password: {
    notEmpty: {
      errorMessage: required('password')
    },
    isLength: {
      errorMessage: minLength('password', 6),
      options: { min: 6 }
    }
  }
})

export const forgotPasswordSchema = checkSchema({
  email: {
    notEmpty: {
      errorMessage: required('email')
    },
    isEmail: {
      errorMessage: valid('email')
    }
  }
})

export const resetPasswordSchema = checkSchema({
  password: {
    notEmpty: {
      errorMessage: required('password')
    },
    isLength: {
      errorMessage: minLength('password', 6),
      options: { min: 6 }
    }
  }
})

export const updateInfoSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: required('name')
    }
  },
  email: {
    notEmpty: {
      errorMessage: required('email')
    },
    isEmail: {
      errorMessage: valid('email')
    }
  }
})

export const updatePasswordSchema = checkSchema({
  password: {
    notEmpty: {
      errorMessage: required('password')
    },
    isLength: {
      errorMessage: minLength('password', 6),
      options: { min: 6 }
    }
  },
  newPassword: {
    notEmpty: {
      errorMessage: required('new password')
    },
    isLength: {
      errorMessage: minLength('new password', 6),
      options: { min: 6 }
    }
  }
})
