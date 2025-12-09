import mongoose, { Schema, Document } from 'mongoose';

export interface IEstateRequest extends Document {
  userId: string;
  category: string;
  buyOrRent: string;
  budget: string;
  area: string;
  bed?: string;
  size?: string;
  additionalInfo?: string;
  status: 'New Request' | 'Receiving Offers' | 'Deal Closed 💯';
  createdAt: Date;
}

const EstateRequestSchema = new Schema<IEstateRequest>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    buyOrRent: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    bed: {
      type: String,
    },
    size: {
      type: String,
    },
    additionalInfo: {
      type: String,
    },
    status: {
      type: String,
      enum: ['New Request', 'Receiving Offers', 'Deal Closed 💯'],
      required: true,
      default: 'New Request',
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

export const EstateRequest = mongoose.model<IEstateRequest>('EstateRequest', EstateRequestSchema);
