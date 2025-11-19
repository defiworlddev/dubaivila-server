import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { authService } from '../services/AuthService';

export interface AdminRequest extends AuthRequest {
  userId: string;
  user: {
    _id: string;
    phoneNumber: string;
    name?: string;
    isAgent: boolean;
    isApproved: boolean;
  };
}

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authReq = req as AdminRequest;
  try {
    // First verify the user is authenticated
    if (!authReq.userId || !authReq.user) {
      return res.status(401).json({ error: 'Unauthorized: User authentication required' });
    }

    // Check if user is an admin
    if (!authService.isAdmin(authReq.user.phoneNumber)) {
      return res.status(403).json({ error: 'Forbidden: Not an admin' });
    }

    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(403).json({ error: 'Forbidden: Admin authentication failed' });
  }
};
