import 'dotenv/config'

const domain = process.env.DOMAIN

const version = process.env.VERSION

const commonRoute = `/api/${version}`

const routes = {
  auth: `${commonRoute}/auth`,
  authSocial: 'api',
  user: `${commonRoute}/user`
}

const serverConf = {
  domain,
  version,
  commonRoute,
  routes
}

export default serverConf
