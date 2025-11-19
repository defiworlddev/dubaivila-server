import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

class WhatsAppService {
  private client: twilio.Twilio | null = null;
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Twilio sandbox number

    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
    } else {
      console.warn('Twilio credentials not configured. WhatsApp messages will not be sent.');
    }
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    if (!this.client) {
      console.log(`[WhatsApp] Verification code for ${phoneNumber}: ${code}`);
      return false;
    }

    try {
      // Format phone number to include whatsapp: prefix
      const formattedNumber = phoneNumber.startsWith('whatsapp:')
        ? phoneNumber
        : `whatsapp:${phoneNumber}`;

      const message = await this.client.messages.create({
        from: this.fromNumber,
        to: formattedNumber,
        body: `Your Dubai Villas verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      });

      console.log(`WhatsApp verification code sent to ${phoneNumber}. Message SID: ${message.sid}`);
      return true;
    } catch (error: any) {
      console.error('Failed to send WhatsApp message:', error.message);
      // Fallback to console log in case of error
      console.log(`[WhatsApp Fallback] Verification code for ${phoneNumber}: ${code}`);
      return false;
    }
  }
}

export const whatsAppService = new WhatsAppService();

