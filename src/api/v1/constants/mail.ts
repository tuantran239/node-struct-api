import { serverConf } from '@config'
import serverCons from './server'

const method = {
  register: 'register',
  resetPassword: 'reset password'
}

const link = {
  register: `${serverConf.domain}${serverCons.routes.auth}/verify`,
  resetPassword: `${serverConf.domain}${serverCons.routes.auth}/reset-password`
}

const mailCons = {
  method,
  link
}

export default mailCons
