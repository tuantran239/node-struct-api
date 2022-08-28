import 'dotenv/config'

const domain = process.env.DOMAIN || 'http://localhost:5000'

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

const version = process.env.VERSION || 'v1'

const commonRoute = `/api/${version}`

const routes = {
  auth: `${commonRoute}/auth`,
  authSocial: '/api',
  user: `${commonRoute}/user`
}

const serverConf = {
  domain,
  version,
  commonRoute,
  routes,
  clientUrl
}

export default serverConf
