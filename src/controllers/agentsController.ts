import { Response } from 'express';
import { AgentRequest } from '../middleware/agentAuth';
import { estateRequestService } from '../services/EstateRequestService';
import { notificationService } from '../services/NotificationService';

export const getAllRequestsWithPhoneNumbers = async (req: any, res: Response) => {
  try {
    const requests = await estateRequestService.getAllRequestsWithPhoneNumbers();
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching requests for agents:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const getRequestByIdWithPhoneNumber = async (req: any, res: Response) => {
  try {
    const agentReq = req as AgentRequest;
    const { id } = req.params;
    const request = await estateRequestService.getRequestByIdWithPhoneNumber(id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Create notification for admin when agent views a request
    if (agentReq.userId) {
      await notificationService.createAgentViewedRequestNotification(id, agentReq.userId);
    }
    
    res.json({ request });
  } catch (error) {
    console.error('Error fetching request for agent:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

