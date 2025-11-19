import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { whatsAppService } from './WhatsAppService';

export interface JWTPayload {
  userId: string;
  phoneNumber: string;
  isAgent: boolean;
  isAdmin: boolean;
}

class AuthService {
  private verificationCodes: Map<string, { code: string; expiresAt: number }> = new Map();
  private readonly CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
  private readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private readonly JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationCode(phoneNumber: string): Promise<string> {
    const code = this.generateVerificationCode();
    const expiresAt = Date.now() + this.CODE_EXPIRY_MS;
    
    this.verificationCodes.set(phoneNumber, { code, expiresAt });
    
    // Send via WhatsApp
    await whatsAppService.sendVerificationCode(phoneNumber, code);
    
    return code;
  }

  async verifyCode(phoneNumber: string, code: string, isAgent?: boolean): Promise<{ isValid: boolean; user?: IUser }> {
    const stored = this.verificationCodes.get(phoneNumber);
    
    if (!stored) {
      return { isValid: false };
    }

    if (Date.now() > stored.expiresAt) {
      this.verificationCodes.delete(phoneNumber);
      return { isValid: false };
    }

    if (stored.code !== code) {
      return { isValid: false };
    }

    // Code is valid, check if user exists
    this.verificationCodes.delete(phoneNumber);
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      // Update existing user if agent flag is provided
      if (isAgent !== undefined && isAgent === true) {
        existingUser.isAgent = true;
        existingUser.isApproved = false; // Agents need admin approval
        await existingUser.save();
      }
      return { isValid: true, user: existingUser };
    }

    // Create new user
    const userData: any = {
      phoneNumber,
      isNewUser: true,
      createdAt: new Date(),
    };

    // If agent flag is provided, set agent status
    if (isAgent === true) {
      userData.isAgent = true;
      userData.isApproved = false; // Agents need admin approval
    }

    const createdUser = await User.create(userData);
    
    return { isValid: true, user: createdUser };
  }

  async completeRegistration(userId: string, name: string, isAgent?: boolean): Promise<IUser | null> {
    const updateData: any = {
      name,
      isNewUser: false,
    };

    // If isAgent is provided, set it (agents need admin approval)
    if (isAgent !== undefined) {
      updateData.isAgent = isAgent;
      // Agents start as not approved, waiting for admin approval
      if (isAgent) {
        updateData.isApproved = false;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );
    
    return user;
  }

  generateToken(user: IUser): string {
    const adminPhoneNumbers = process.env.ADMIN_PHONE_NUMBERS?.split(',').map(num => num.trim()) || [];
    const isAdmin = adminPhoneNumbers.includes(user.phoneNumber);

    const payload: JWTPayload = {
      userId: user._id.toString(),
      phoneNumber: user.phoneNumber,
      isAgent: user.isAgent,
      isAdmin,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRY,
    } as SignOptions);
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  isAdmin(phoneNumber: string): boolean {
    const adminPhoneNumbers = process.env.ADMIN_PHONE_NUMBERS?.split(',').map(num => num.trim()) || [];
    return adminPhoneNumbers.includes(phoneNumber);
  }
}

export const authService = new AuthService();
