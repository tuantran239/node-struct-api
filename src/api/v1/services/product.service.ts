import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery
} from 'mongoose'
import Product, { ProductDocument } from '../models/Product'
import { destroyCloudinary } from '../utils/cloudinary'
import { FuncHandleService } from '../utils/functions/funcService'
import {
  createDoc,
  getDoc,
  getAllDocs,
  deleteDoc,
  updateDoc,
  docExist,
  getNumberOfDocs
} from './db.service'

export const createProduct = (body: Partial<ProductDocument>) =>
  createDoc('Error create product', Product, body)

// export const getUserExist = (
//   exist: boolean,
//   filter?: FilterQuery<ProductDocument>,
//   projection?: ProjectionType<ProductDocument> | null,
//   options?: QueryOptions<ProductDocument> | null
// ) => docExist('Error get user exist', User, 'User', exist, filter, projection, options)

export const getProduct = (
  filter?: FilterQuery<ProductDocument>,
  projection?: ProjectionType<ProductDocument> | null,
  options?: QueryOptions<ProductDocument> | null
) => getDoc('Error get product', Product, filter, projection, options)

export const getNumberOfProduct = (filter: FilterQuery<ProductDocument>) =>
  getNumberOfDocs('Error get number product', Product, filter)

export const getAllProduct = (
  filter: FilterQuery<ProductDocument>,
  projection?: ProjectionType<ProductDocument> | null,
  options?: QueryOptions<ProductDocument> | null
) => getAllDocs('Error get all product', Product, filter, projection, options)

// export const deleteUser = (
//   filter: FilterQuery<ProductDocument>,
//   options?: QueryOptions<ProductDocument> | null
// ) => deleteDoc('Error delete user', User, filter, options)

export const updateProduct = (
  filter: FilterQuery<ProductDocument>,
  update?: UpdateQuery<ProductDocument>,
  options?: QueryOptions<ProductDocument> | null
) => updateDoc('Error update user', Product, filter, update, options)

// export const deleteAvatar = (publicId: any) =>
//   FuncHandleService('Error delete avatar', async () => {
//     if (publicId === null) return true
//     await destroyCloudinary(publicId)
//     return true
//   })
