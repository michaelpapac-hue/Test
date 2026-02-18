import { Router } from 'express';
import multer from 'multer';
import {
  createDailyReport,
  exportReportPdf,
  finalizeReport,
  uploadReportPhoto,
} from '../controllers/report.controller.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);
router.post('/', requireRoles(['SUPER', 'PM']), createDailyReport);
router.post('/:reportId/photos', requireRoles(['SUPER', 'PM', 'SAFETY']), upload.single('photo'), uploadReportPhoto);
router.post('/:reportId/finalize', requireRoles(['SUPER', 'PM']), finalizeReport);
router.get('/:reportId/export/pdf', requireRoles(['SUPER', 'PM', 'EXEC']), exportReportPdf);

export default router;
