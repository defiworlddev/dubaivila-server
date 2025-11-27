import { User, IUser } from '../models/User';

class AdminService {
  async getAllUsers(): Promise<IUser[]> {
    return await User.find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateUserIsAgent(userId: string, isAgent: boolean): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isAgent,
      },
      { new: true }
    );

    return user;
  }
}

export const adminService = new AdminService();

