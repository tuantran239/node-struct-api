import { MethodPermission, ObjectPermission } from '../types/user.type'

export const mapPermissionString = () => {
  const permissions: string[] = []
  Object.values(ObjectPermission).forEach((obj) => {
    Object.values(MethodPermission).forEach((method) => {
      permissions.push(`${method}_${obj}`)
    })
  })
  return permissions
}
