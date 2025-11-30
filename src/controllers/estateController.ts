import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { estateRequestService } from '../services/EstateRequestService';

export const getAllRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await estateRequestService.getAllRequests();

    res.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const getMyRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const requests = await estateRequestService.getRequestsByUser(userId);
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      propertyType,
      location,
      budget,
      bedrooms,
      bathrooms,
      surface,
      district,
      additionalRequirements,
    } = req.body;

    if (!propertyType || !location || !budget) {
      return res.status(400).json({
        error: 'Property type, location, and budget are required'
      });
    }

    const request = await estateRequestService.createRequest(userId, {
      propertyType,
      location,
      budget,
      bedrooms,
      bathrooms,
      surface,
      district,
      additionalRequirements,
    });

    res.status(201).json({ request });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

export const getRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await estateRequestService.getRequestById(id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({ request });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required (pending, in_progress, completed)'
      });
    }

    const request = await estateRequestService.updateRequestStatus(id, status);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ request });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Failed to update request status' });
  }
};

