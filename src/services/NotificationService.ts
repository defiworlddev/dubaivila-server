import { Notification, INotification } from '../models/Notification';
import { User } from '../models/User';

class NotificationService {
  async createAgentViewedRequestNotification(
    requestId: string,
    agentId: string
  ): Promise<INotification | null> {
    try {
      // Get agent info
      const agent = await User.findById(agentId);
      if (!agent) {
        return null;
      }

      const message = `Agent ${agent.name || agent.phoneNumber} viewed request ${requestId.slice(-8)}`;

      const notification = await Notification.create({
        type: 'agent_viewed_request',
        requestId,
        agentId,
        agentName: agent.name,
        agentPhoneNumber: agent.phoneNumber,
        message,
        isRead: false,
        createdAt: new Date(),
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  async getAllNotifications(): Promise<INotification[]> {
    return await Notification.find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUnreadNotifications(): Promise<INotification[]> {
    return await Notification.find({ isRead: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(): Promise<void> {
    await Notification.updateMany({ isRead: false }, { isRead: true });
  }

  async getUnreadCount(): Promise<number> {
    return await Notification.countDocuments({ isRead: false });
  }
}

export const notificationService = new NotificationService();

