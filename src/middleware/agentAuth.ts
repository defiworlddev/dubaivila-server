import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { User } from '../models/User';

export interface AgentRequest extends AuthRequest {
  userId: string;
  user: {
    _id: string;
    phoneNumber: string;
    name?: string;
    isAgent: boolean;
    isApproved: boolean;
  };
}

export const authenticateAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const agentReq = req as AgentRequest;
  try {
    // First verify the user is authenticated
    if (!agentReq.userId || !agentReq.user) {
      return res.status(401).json({ error: 'Unauthorized: User authentication required' });
    }

    // Check if user is an agent
    if (!agentReq.user.isAgent) {
      return res.status(403).json({ error: 'Forbidden: User is not an agent' });
    }

    // Check if agent is approved
    if (!agentReq.user.isApproved) {
      return res.status(403).json({ error: 'Forbidden: Agent approval pending' });
    }

    // Verify user still exists and is still an approved agent
    const user = await User.findById(agentReq.userId);
    if (!user || !user.isAgent || !user.isApproved) {
      return res.status(403).json({ error: 'Forbidden: Agent status invalid' });
    }

    next();
  } catch (error) {
    console.error('Agent authentication error:', error);
    return res.status(403).json({ error: 'Forbidden: Agent authentication failed' });
  }
};

