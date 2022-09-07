import { serverConf } from '@config'

const commonRoute = `/api/${serverConf.version}`

const routes = {
  auth: `${commonRoute}/auth`,
  authSocial: '/api',
  user: `${commonRoute}/user`,
  product: `${commonRoute}/product`
}

const serverCons = {
  routes,
  commonRoute
}

export default serverCons
