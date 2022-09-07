import server from './server'

import 'dotenv/config'

const user = process.env.EMAIL_USER

const password = process.env.EMAIL_PASSWORD

const mailConf = {
  user,
  password
}

export default mailConf
