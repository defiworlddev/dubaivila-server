import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authenticateAgent } from '../middleware/agentAuth';
import * as agentsController from '../controllers/agentsController';

const router = Router();

// All agent routes require both user authentication and agent verification
router.use(authenticate);
router.use(authenticateAgent);

router.get('/requests', agentsController.getAllRequestsWithPhoneNumbers);
router.get('/requests/:id', agentsController.getRequestByIdWithPhoneNumber);

export default router;

