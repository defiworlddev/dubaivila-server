import mongoose from 'mongoose';
import { EstateRequest, IEstateRequest } from '../models/EstateRequest';
import { User } from '../models/User';

export interface IRequestWithPhoneNumber {
  _id: string;
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
  userPhoneNumber?: string;
}

class EstateRequestService {
  async getAllRequests(): Promise<IEstateRequest[]> {
    return await EstateRequest.find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllRequestsWithPhoneNumbers(): Promise<IRequestWithPhoneNumber[]> {
    const requests = await EstateRequest.find()
      .sort({ createdAt: -1 })
      .exec();

    const userIds = [...new Set(requests.map(r => r.userId))];
    const userIdsAsObjectIds = userIds
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));
    const users = await User.find({ _id: { $in: userIdsAsObjectIds } }).exec();
    const userMap = new Map(users.map(u => [u._id.toString(), u.phoneNumber]));

    return requests.map(request => {
      const requestObj = request.toObject();
      return {
        _id: requestObj._id.toString(),
        userId: requestObj.userId,
        propertyType: requestObj.propertyType,
        location: requestObj.location,
        budget: requestObj.budget,
        bedrooms: requestObj.bedrooms,
        bathrooms: requestObj.bathrooms,
        surface: requestObj.surface,
        district: requestObj.district,
        additionalRequirements: requestObj.additionalRequirements,
        status: requestObj.status,
        createdAt: requestObj.createdAt,
        userPhoneNumber: userMap.get(request.userId) || undefined,
      };
    });
  }

  async getRequestsByUser(userId: string): Promise<IEstateRequest[]> {
    return await EstateRequest.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getRequestById(requestId: string): Promise<IEstateRequest | null> {
    return await EstateRequest.findById(requestId).exec();
  }

  async createRequest(
    userId: string,
    requestData: any
  ): Promise<IEstateRequest> {
    const request = await EstateRequest.create({
      userId,
      ...requestData,
      status: 'pending',
      createdAt: new Date(),
    });

    return request;
  }

  async updateRequestStatus(
    requestId: string,
    status: IEstateRequest['status']
  ): Promise<IEstateRequest | null> {
    return await EstateRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
  }

  async getRequestByIdWithPhoneNumber(requestId: string): Promise<IRequestWithPhoneNumber | null> {
    const request = await EstateRequest.findById(requestId).exec();
    
    if (!request) {
      return null;
    }

    let userPhoneNumber: string | undefined;
    if (mongoose.Types.ObjectId.isValid(request.userId)) {
      const user = await User.findById(request.userId).exec();
      userPhoneNumber = user?.phoneNumber;
    }

    const requestObj = request.toObject();
    return {
      _id: requestObj._id.toString(),
      userId: requestObj.userId,
      propertyType: requestObj.propertyType,
      location: requestObj.location,
      budget: requestObj.budget,
      bedrooms: requestObj.bedrooms,
      bathrooms: requestObj.bathrooms,
      surface: requestObj.surface,
      district: requestObj.district,
      additionalRequirements: requestObj.additionalRequirements,
      status: requestObj.status,
      createdAt: requestObj.createdAt,
      userPhoneNumber,
    };
  }

  async deleteRequest(requestId: string): Promise<boolean> {
    const result = await EstateRequest.findByIdAndDelete(requestId).exec();
    return result !== null;
  }
}

export const estateRequestService = new EstateRequestService();
