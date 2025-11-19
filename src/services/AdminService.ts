import { User, IUser } from '../models/User';

class AdminService {
  async getAllUsers(): Promise<IUser[]> {
    return await User.find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async approveAgent(userId: string): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isAgent: true,
        isApproved: true,
      },
      { new: true }
    );

    return user;
  }

  async getPendingAgents(): Promise<IUser[]> {
    return await User.find({
      isAgent: true,
      isApproved: false,
    })
      .sort({ createdAt: -1 })
      .exec();
  }
}

export const adminService = new AdminService();

