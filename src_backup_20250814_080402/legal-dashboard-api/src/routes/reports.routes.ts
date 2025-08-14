import { Router } from 'express';
import * as controller from '@controllers/reports.controller';

const router = Router();

router.get('/summary', controller.summary);
router.get('/performance', controller.performance);
router.get('/user-activity', controller.userActivity);
router.get('/document-analytics', controller.documentAnalytics);
router.get('/export/csv', controller.exportCsv);
router.get('/cache-stats', controller.cacheStats);
router.get('/notification-stats', controller.notificationStats);
router.get('/system-health', controller.systemHealth);
router.get('/trends', controller.trends);

export default router;


