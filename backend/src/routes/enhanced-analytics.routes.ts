import { Router } from 'express';
import * as controller from '@controllers/enhanced-analytics.controller';
import { requireAuth } from '@middleware/auth.middleware';

const router = Router();

router.get('/predictive-insights', requireAuth, controller.predictiveInsights);
router.get('/real-time-metrics', requireAuth, controller.realTimeMetrics);
router.get('/system-health', requireAuth, controller.systemHealth);

export default router;


