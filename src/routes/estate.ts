import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as estateController from '../controllers/estateController';

const router = Router();

router.use(authenticate);

router.get('/requests', estateController.getAllRequests);
router.get('/my-requests', estateController.getMyRequests);
router.post('/requests', estateController.createRequest);
router.patch('/requests/:id/status', estateController.updateRequestStatus);

export default router;
