import { Router } from 'express'

import authRoutes from './auth.route'
import roleRoutes from './admin/role.route'
import userRoutes from './user.route'
import server from '../config/server'

const routes = Router()

routes.use(`${server.version}/${server.routes.auth}`, authRoutes)

routes.use(`${server.version}/${server.routes.role}`, roleRoutes)

routes.use(`${server.version}/${server.routes.user}`, userRoutes)

export default routes
