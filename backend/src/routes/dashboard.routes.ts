import { Router } from 'express';
import * as controller from '@controllers/dashboard.controller';

const router = Router();

router.get('/summary', controller.summary);
router.get('/charts-data', controller.chartsData);
router.get('/ai-suggestions', controller.aiSuggestions);
router.get('/ai-training-stats', controller.aiTrainingStats);
router.post('/ai-feedback', controller.aiFeedback);
router.get('/performance-metrics', controller.performanceMetrics);
router.get('/trends', controller.trends);

export default router;


