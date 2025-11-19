import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    _id: string;
    phoneNumber: string;
    name?: string;
    isAgent: boolean;
    isApproved: boolean;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = authService.verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Verify user still exists
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.userId = payload.userId;
    req.user = {
      _id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      name: user.name,
      isAgent: user.isAgent,
      isApproved: user.isApproved,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized: Authentication failed' });
  }
};
