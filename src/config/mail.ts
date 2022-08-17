import server from './server'

import 'dotenv/config'

const user = process.env.EMAIL_USER

const password = process.env.EMAIL_PASSWORD

const method = {
  register: 'register',
  resetPassword: 'resetPassword'
}

const link = {
  register: `${server.domain}${server.routes.auth}/verify`,
  resetPassword: `${server.domain}${server.routes.auth}/reset-password`
}

const mailConf = {
  user,
  password,
  method,
  link
}

export default mailConf
