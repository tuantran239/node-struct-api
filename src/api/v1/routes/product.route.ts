import { createProductHandler, getProductHandler, getProductsHandler } from '@api/controllers/product.controller'
import { Router } from 'express'
import { authenticate, multerMultiFile, multerSingleFile, validate } from '@api/middlewares'
import { createProductSchema } from '@api/validator-schema/product.schema'

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
