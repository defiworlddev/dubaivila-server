import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type: 'agent_viewed_request';
  requestId: string;
  agentId: string;
  agentName?: string;
  agentPhoneNumber?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      required: true,
      enum: ['agent_viewed_request'],
    },
    requestId: {
      type: String,
      required: true,
      index: true,
    },
    agentId: {
      type: String,
      required: true,
      index: true,
    },
    agentName: {
      type: String,
    },
    agentPhoneNumber: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
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

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

