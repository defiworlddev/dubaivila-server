import { Response } from 'express';
import { Request } from 'express';
import { AdminRequest } from '../middleware/adminAuth';
import { adminService } from '../services/AdminService';
import { authService } from '../services/AuthService';
import { notificationService } from '../services/NotificationService';
import { estateRequestService } from '../services/EstateRequestService';

export const adminAuth = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({ error: 'Phone number and code are required' });
    }

    const adminPhoneNumbers = process.env.ADMIN_PHONE_NUMBERS?.split(',').map(num => num.trim()) || [];

    if (!adminPhoneNumbers.includes(phoneNumber)) {
      return res.status(403).json({ error: 'Forbidden: Not an admin phone number' });
    }

    const result = await authService.verifyCode(phoneNumber, code);

    if (!result.isValid) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    if (!result.user) {
      return res.status(500).json({ error: 'User creation failed' });
    }

    const token = authService.generateToken(result.user);

    res.json({ user: result.user, isAdmin: true, token });
  } catch (error) {
    console.error('Error in admin auth:', error);
    res.status(500).json({ error: 'Failed to authenticate admin' });
  }
};

export const sendAdminVerification = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const adminPhoneNumbers = process.env.ADMIN_PHONE_NUMBERS?.split(',').map(num => num.trim()) || [];

    if (!adminPhoneNumbers.includes(phoneNumber)) {
      return res.status(403).json({ error: 'Forbidden: Not an admin phone number' });
    }

    const code = await authService.sendVerificationCode(phoneNumber);
    
    res.json({ 
      message: 'Verification code sent to WhatsApp',
      code: process.env.NODE_ENV === 'development' ? code : undefined
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const adminReq = req as AdminRequest;
    const users = await adminService.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getPendingAgents = async (req: Request, res: Response) => {
  try {
    const adminReq = req as AdminRequest;
    const agents = await adminService.getPendingAgents();
    res.json({ agents });
  } catch (error) {
    console.error('Error fetching pending agents:', error);
    res.status(500).json({ error: 'Failed to fetch pending agents' });
  }
};

export const approveAgent = async (req: Request, res: Response) => {
  const adminReq = req as AdminRequest;
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await adminService.approveAgent(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user, message: 'Agent approved successfully' });
  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({ error: 'Failed to approve agent' });
  }
};

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const adminReq = req as AdminRequest;
    const notifications = await notificationService.getAllNotifications();
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const adminReq = req as AdminRequest;
    const notifications = await notificationService.getUnreadNotifications();
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ error: 'Failed to fetch unread notifications' });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const adminReq = req as AdminRequest;
    const count = await notificationService.getUnreadCount();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const adminReq = req as AdminRequest;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Notification ID is required' });
    }

    const notification = await notificationService.markAsRead(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ notification, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const adminReq = req as AdminRequest;
    await notificationService.markAllAsRead();
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const adminReq = req as AdminRequest;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    const deleted = await estateRequestService.deleteRequest(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
};

