import { Router } from 'express'

import authRoutes from './auth.route'
import authSocialRoutes from './authsocial.route'
import userRoutes from './user.route'
import { serverConf } from '../../../config'

const routes = Router()

routes.use(serverConf.routes.auth, authRoutes)

routes.use(serverConf.routes.authSocial, authSocialRoutes)

routes.use(serverConf.routes.user, userRoutes)

export default routes
