import { Router } from 'express';
import { getExecutiveDashboard } from '../controllers/dashboard.controller.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/executive', requireRoles(['EXEC', 'ADMIN', 'PM']), getExecutiveDashboard);

export default router;
