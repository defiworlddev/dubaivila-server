import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authService } from '../services/AuthService';
import { User } from '../models/User';

export const sendVerification = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
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

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, code, agent } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({ error: 'Phone number and code are required' });
    }

    const isAgent = agent === true || agent === 'true';

    const result = await authService.verifyCode(phoneNumber, code, isAgent);

    if (!result.isValid) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    if (!result.user) {
      return res.status(500).json({ error: 'User creation failed' });
    }

    const token = authService.generateToken(result.user);

    res.json({ user: result.user, token });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
};

export const completeRegistration = async (req: Request, res: Response) => {
  try {
    const { userId, name, isAgent } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: 'User ID and name are required' });
    }

    const user = await authService.completeRegistration(userId, name, isAgent);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = authService.generateToken(user);

    res.json({ user, token });
  } catch (error) {
    console.error('Error completing registration:', error);
    res.status(500).json({ error: 'Failed to complete registration' });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

