import { Router } from 'express';
import * as controller from '@controllers/analytics.controller';
import { requireAuth } from '@middleware/auth.middleware';

const router = Router();

// Dashboard analytics
router.get('/overview', requireAuth, controller.overview);

// Document analytics
router.post('/documents/:id/analyze', requireAuth, controller.analyzeDocument);
router.get('/documents/:id/sentiment', requireAuth, controller.sentiment);
router.get('/documents/:id/entities', requireAuth, controller.entities);
router.get('/documents/:id/category', requireAuth, controller.predictCategory);

// Comparative analytics
router.get('/similarity', requireAuth, controller.similarity);

// Topic modeling
router.post('/topics', requireAuth, controller.generateTopics);

export default router;


