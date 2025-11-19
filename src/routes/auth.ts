import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/send-verification', authController.sendVerification);
router.post('/verify', authController.verifyCode);
router.post('/complete-registration', authController.completeRegistration);
router.get('/user', authenticate, authController.getUser);

export default router;
