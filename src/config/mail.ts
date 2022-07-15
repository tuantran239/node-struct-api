import server from './server'

require('dotenv').config()

const user = process.env.EMAIL_USER

const password = process.env.EMAIL_PASSWORD

const method = {
  register: 'register',
  resetPassword: 'resetPassword'
}

const link = {
  register: `${server.domain}/${server.version}/${server.routes.auth}/verify`,
  resetPassword: `${server.domain}/${server.version}/${server.routes.auth}/reset-password`
}

const mail = {
  user,
  password,
  method,
  link
}

export default mail
