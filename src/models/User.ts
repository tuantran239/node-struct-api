import { model, Schema, Document } from 'mongoose'
import { RoleDocument } from './Role'
import { hash, compare } from 'bcrypt'

export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  role: RoleDocument['_id']
  avatar: {
    url: string
    public_id: string
  }
  token: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword: (password: string) => boolean
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    avatar: {
      url: String,
      public_id: String
    },
    active: {
      type: Boolean,
      default: false
    },
    token: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.comparePassword = async function (password: string) {
  const user = this
  return await compare(password, user.password)
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await hash(user.password, 8)
  }
  next()
})

const User = model<UserDocument>('User', userSchema)

export default User
