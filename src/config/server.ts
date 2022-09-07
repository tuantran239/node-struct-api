import 'dotenv/config'

const domain = process.env.DOMAIN || 'http://localhost:5000'

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

const adminUrl = process.env.ADMIN_URL || 'http://localhost:3005'

const version = process.env.VERSION || 'v1'

const serverConf = {
  domain,
  version,
  clientUrl,
  adminUrl
}

export default serverConf
