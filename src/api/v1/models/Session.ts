import { UserDocument } from './User'
import { Schema, model, Document } from 'mongoose'

export interface SessionDocument extends Document {
  valid: boolean
  user: UserDocument['_id']
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    valid: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

const Session = model<SessionDocument>('Session', sessionSchema)

export default Session
