const validateFunc = (errorMessage: string, message?: string) => {
  if (message) {
    return message
  }
  return errorMessage
}

export const required = (filed: string, message?: string) => {
  const errorMessage = `${filed} is required`
  return validateFunc(errorMessage, message)
}

export const valid = (filed: string, message?: string) => {
  const errorMessage = `${filed} not valid`
  return validateFunc(errorMessage, message)
}

export const minLength = (filed: string, min: number, message?: string) => {
  const errorMessage = `${filed} should be at least ${min} chars long`
  return validateFunc(errorMessage, message)
}

export const maxLength = (filed: string, max: number, message?: string) => {
  const errorMessage = `${filed} exceeds ${max} chars long`
  return validateFunc(errorMessage, message)
}

export const min = (filed: string, min: number, message?: string) => {
  const errorMessage = `${filed} min is ${min}`
  return validateFunc(errorMessage, message)
}

export const max = (filed: string, max: number, message?: string) => {
  const errorMessage = `${filed} max is ${max}`
  return validateFunc(errorMessage, message)
}
