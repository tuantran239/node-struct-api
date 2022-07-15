import { model, Schema, Document } from 'mongoose'
import { UserRole } from '../types/user.type'
import { mapPermissionString } from '../utils/map'

const premissions = mapPermissionString()

export interface RoleDocument extends Document {
  name: string
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: [UserRole.USER, UserRole.ADMIN],
      required: true
    },
    permissions: [
      {
        type: String,
        enum: premissions
      }
    ]
  },
  {
    timestamps: true
  }
)

const Role = model<RoleDocument>('Role', roleSchema)

export default Role
