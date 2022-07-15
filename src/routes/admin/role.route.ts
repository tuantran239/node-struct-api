import { Router } from 'express'
import { createRoleHandler } from '../../controllers/role.controller'
import { autheticate, authRole } from '../../middlewares/authenticate'
import { UserRole } from '../../types/user.type'

const router = Router()

router.post('/', autheticate, authRole([UserRole.ADMIN]), createRoleHandler)

export default router
