const validateFunc = (errorMessage: string, message: string | null) => {
  if (message) {
    return message
  }
  return errorMessage
}

export const required = (filed: string, message = null) => {
  const errorMessage = `${filed} is required`
  return validateFunc(errorMessage, message)
}

export const valid = (filed: string, message = null) => {
  const errorMessage = `${filed} not valid`
  return validateFunc(errorMessage, message)
}

export const minLength = (filed: string, min: number, message = null) => {
  const errorMessage = `${filed} should be at least ${min} chars long`
  return validateFunc(errorMessage, message)
}

export const maxLength = (filed: string, max: number, message = null) => {
  const errorMessage = `${filed} exceeds ${max} chars long`
  return validateFunc(errorMessage, message)
}

export const min = (filed: string, min: number, message = null) => {
  const errorMessage = `${filed} min is ${min}`
  return validateFunc(errorMessage, message)
}

export const max = (filed: string, max: number, message = null) => {
  const errorMessage = `${filed} max is ${max}`
  return validateFunc(errorMessage, message)
}
