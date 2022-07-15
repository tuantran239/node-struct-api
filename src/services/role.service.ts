import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery
} from 'mongoose'
import Role, { RoleDocument } from '../models/Role'
import {
  createDoc,
  getDoc,
  getAllDocs,
  deleteDoc,
  updateDoc,
  docExist
} from './db.service'

export const createRole = (body: Partial<RoleDocument>) =>
  createDoc('Error create role', Role, body)

export const getRoleExist = (
  exist: boolean,
  filter?: FilterQuery<RoleDocument>,
  projection?: ProjectionType<RoleDocument> | null,
  options?: QueryOptions<RoleDocument> | null
) =>
  docExist(
    'Error get role exist',
    Role,
    'Role',
    exist,
    filter,
    projection,
    options
  )

export const getRole = (
  filter?: FilterQuery<RoleDocument>,
  projection?: ProjectionType<RoleDocument> | null,
  options?: QueryOptions<RoleDocument> | null
) => getDoc('Error get role', Role, filter, projection, options)

export const getAllRole = (
  filter: FilterQuery<RoleDocument>,
  projection?: ProjectionType<RoleDocument> | null,
  options?: QueryOptions<RoleDocument> | null
) => getAllDocs('Error get all roles', Role, filter, projection, options)

export const deleteRole = (
  filter: FilterQuery<RoleDocument>,
  options?: QueryOptions<RoleDocument> | null
) => deleteDoc('Error delete role', Role, filter, options)

export const updateRole = (
  filter: FilterQuery<RoleDocument>,
  update?: UpdateQuery<RoleDocument>,
  options?: QueryOptions<RoleDocument> | null
) => updateDoc('Error update role', Role, filter, update, options)
