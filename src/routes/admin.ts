import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authenticateAdmin } from '../middleware/adminAuth';
import * as adminController from '../controllers/adminController';

const router = Router();

// Admin authentication endpoints (no middleware needed)
router.post('/auth', adminController.adminAuth);
router.post('/send-verification', adminController.sendAdminVerification);

// Admin protected routes - require user authentication and admin verification
router.get('/users', authenticate, authenticateAdmin, adminController.getAllUsers);
router.put('/users/:userId/isAgent', authenticate, authenticateAdmin, adminController.updateUserIsAgent);

// Notification routes
router.get('/notifications', authenticate, authenticateAdmin, adminController.getAllNotifications);
router.get('/notifications/unread', authenticate, authenticateAdmin, adminController.getUnreadNotifications);
router.get('/notifications/unread/count', authenticate, authenticateAdmin, adminController.getUnreadCount);
router.put('/notifications/:id/read', authenticate, authenticateAdmin, adminController.markNotificationAsRead);
router.put('/notifications/read-all', authenticate, authenticateAdmin, adminController.markAllNotificationsAsRead);

// Request routes
router.delete('/requests/:id', authenticate, authenticateAdmin, adminController.deleteRequest);

export default router;

