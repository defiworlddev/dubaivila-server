import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phoneNumber: string;
  name?: string;
  isNewUser: boolean;
  isAgent: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
    },
    isNewUser: {
      type: Boolean,
      required: true,
      default: true,
    },
    isAgent: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
