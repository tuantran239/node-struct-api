import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery
} from 'mongoose'
import User, { UserDocument } from '../models/User'
import { destroyCloudinary, uploadToCloudinary } from '../utils/cloudinary'
import { FuncHandleService } from '../utils/functions/funcService'
import {
  createDoc,
  getDoc,
  getAllDocs,
  deleteDoc,
  updateDoc,
  docExist
} from './db.service'

export const createUser = (body: Partial<UserDocument>) =>
  createDoc('Error create user', User, body)

export const getUserExist = (
  exist: boolean,
  filter?: FilterQuery<UserDocument>,
  projection?: ProjectionType<UserDocument> | null,
  options?: QueryOptions<UserDocument> | null
) =>
  docExist(
    'Error get user exist',
    User,
    'User',
    exist,
    filter,
    projection,
    options
  )

export const getUser = (
  filter?: FilterQuery<UserDocument>,
  projection?: ProjectionType<UserDocument> | null,
  options?: QueryOptions<UserDocument> | null
) => getDoc('Error get user', User, filter, projection, options)

export const getAllUser = (
  filter: FilterQuery<UserDocument>,
  projection?: ProjectionType<UserDocument> | null,
  options?: QueryOptions<UserDocument> | null
) => getAllDocs('Error get all users', User, filter, projection, options)

export const deleteUser = (
  filter: FilterQuery<UserDocument>,
  options?: QueryOptions<UserDocument> | null
) => deleteDoc('Error delete user', User, filter, options)

export const updateUser = (
  filter: FilterQuery<UserDocument>,
  update?: UpdateQuery<UserDocument>,
  options?: QueryOptions<UserDocument> | null
) => updateDoc('Error update user', User, filter, update, options)

export const uploadAvatar = (file: Express.Multer.File, folder: string) =>
  FuncHandleService('Error upload avatar', async () => {
    const encoded = 'data:image/png;base64,' + file.buffer.toString('base64')
    const result = await uploadToCloudinary(encoded, folder)
    return result
  })

export const deleteAvatar = (publicId: any) =>
  FuncHandleService('Error delete avatar', async () => {
    if (publicId === null) return true
    await destroyCloudinary(publicId)
    return true
  })
