require('dotenv').config()

const domain = process.env.DOMAIN

const version = process.env.VERSION

const routes = {
  auth: '/api/auth',
  role: '/api/role',
  user: '/api/auth'
}

const server = {
  domain,
  version,
  routes
}

export default server
