import mongoose from 'mongoose';
import { EstateRequest, IEstateRequest } from '../models/EstateRequest';
import { User } from '../models/User';

export interface IRequestWithPhoneNumber {
  _id: string;
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
  userPhoneNumber?: string;
  userName?: string;
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
    const userPhoneMap = new Map(users.map(u => [u._id.toString(), u.phoneNumber]));
    const userNameMap = new Map(users.map(u => [u._id.toString(), u.name]));

    return requests.map(request => {
      const requestObj = request.toObject();
      return {
        _id: requestObj._id.toString(),
        userId: requestObj.userId,
        category: requestObj.category,
        buyOrRent: requestObj.buyOrRent,
        budget: requestObj.budget,
        area: requestObj.area,
        bed: requestObj.bed,
        size: requestObj.size,
        additionalInfo: requestObj.additionalInfo,
        status: requestObj.status,
        createdAt: requestObj.createdAt,
        userPhoneNumber: userPhoneMap.get(request.userId) || undefined,
        userName: userNameMap.get(request.userId) || undefined,
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
      status: 'New Request',
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
    let userName: string | undefined;
    if (mongoose.Types.ObjectId.isValid(request.userId)) {
      const user = await User.findById(request.userId).exec();
      userPhoneNumber = user?.phoneNumber;
      userName = user?.name;
    }

    const requestObj = request.toObject();
    return {
      _id: requestObj._id.toString(),
      userId: requestObj.userId,
      category: requestObj.category,
      buyOrRent: requestObj.buyOrRent,
      budget: requestObj.budget,
      area: requestObj.area,
      bed: requestObj.bed,
      size: requestObj.size,
      additionalInfo: requestObj.additionalInfo,
      status: requestObj.status,
      createdAt: requestObj.createdAt,
      userPhoneNumber,
      userName,
    };
  }

  async deleteRequest(requestId: string): Promise<boolean> {
    const result = await EstateRequest.findByIdAndDelete(requestId).exec();
    return result !== null;
  }
}

export const estateRequestService = new EstateRequestService();
