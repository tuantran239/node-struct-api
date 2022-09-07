import { cloudinaryCons, productCons } from '@api/constants'
import { CommonErrorResponse } from '@api/error/http-error'
import {
  createProduct,
  getAllProduct,
  getNumberOfProduct,
  getProduct
} from '@api/services/product.service'
import { HttpResponse } from '@api/utils'
import { FilterProducts } from '@api/utils/filter'
import { uploadMultiFileWorker } from '@api/worker/upload-worker'
import { Request, Response } from 'express'

export const createProductHandler = async (req: Request, res: Response) => {
  const files = req.files
  const { name, gender, description, price, categories, productType } = req.body

  const { data: product, error } = await createProduct({
    name,
    gender,
    description,
    price,
    categories,
    productType: JSON.parse(productType)
  })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  await uploadMultiFileWorker({
    name: 'product',
    productId: product?.id,
    folder: cloudinaryCons.folder('product', product?.name),
    files,
    resize: { width: 560, height: 560 }
  })

  return HttpResponse(res, 200, { success: true })
}

export const getProductsHandler = async (req: Request, res: Response) => {
  const { filter, options } = FilterProducts(req.query)
  const { data: products, error } = await getAllProduct(
    filter,
    'name price mainImage productType.color',
    options
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  let pages = 0
  const { data: numOfProds } = await getNumberOfProduct(filter)
  if (numOfProds) {
    pages = Math.ceil(numOfProds / productCons.LIMIT)
  }

  return HttpResponse(res, 200, {
    success: true,
    products,
    pages,
    results: numOfProds || 0
  })
}

export const getProductHandler = async (req: Request, res: Response) => {
  const { data: product, error } = await getProduct(
    { _id: req.params.id },
    'name price description mainImage productType images'
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, {
    success: true,
    product
  })
}
