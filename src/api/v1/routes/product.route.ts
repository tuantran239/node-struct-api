import { createProductHandler, getProductHandler, getProductsHandler } from '@api-v1/controllers/product.controller'
import { Router } from 'express'
import { multerMultiFile } from '@api-v1/middlewares'
import { createProductSchema } from '@api-v1/validator-schema/product.schema'

const router = Router()

router.post(
  '/create-product',
  // authenticate,
  // createProductSchema,
  // validate,
  multerMultiFile('images'),
  createProductHandler
)

router.get(
  '/',
  getProductsHandler
)

router.get(
  '/:id',
  getProductHandler
)

export default router
