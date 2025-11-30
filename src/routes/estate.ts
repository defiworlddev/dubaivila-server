import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as estateController from '../controllers/estateController';

const router = Router();

router.get('/requests', estateController.getAllRequests);
router.get('/requests/:id', estateController.getRequestById);
router.get('/my-requests', authenticate, estateController.getMyRequests);
router.post('/requests', authenticate, estateController.createRequest);
router.patch('/requests/:id/status', authenticate, estateController.updateRequestStatus);

export default router;
