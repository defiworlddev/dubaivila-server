import mongoose, { Schema, Document } from 'mongoose';

export interface IEstateRequest extends Document {
  userId: string;
  propertyType: string;
  location: string;
  budget: string;
  bedrooms?: string;
  bathrooms?: string;
  surface?: string;
  district?: string;
  additionalRequirements?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
}

const EstateRequestSchema = new Schema<IEstateRequest>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: String,
    },
    bathrooms: {
      type: String,
    },
    surface: {
      type: String,
    },
    district: {
      type: String,
    },
    additionalRequirements: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      required: true,
      default: 'pending',
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
