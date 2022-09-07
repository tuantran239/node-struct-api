import { Router } from 'express'

import authRoutes from './auth.route'
import authSocialRoutes from './authsocial.route'
import userRoutes from './user.route'
import productRoutes from './product.route'
import { serverCons } from '@api/constants'

const routes = Router()

routes.use(serverCons.routes.auth, authRoutes)

routes.use(serverCons.routes.authSocial, authSocialRoutes)

routes.use(serverCons.routes.user, userRoutes)

routes.use(serverCons.routes.product, productRoutes)

export default routes
