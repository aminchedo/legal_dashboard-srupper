import { Router } from 'express';
import * as controller from '../controllers/rating.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Document rating routes
router.post('/documents/:id', requireAuth, controller.rateDocument);
router.get('/documents/:id/user', requireAuth, controller.getUserRating);
router.get('/documents/:id', requireAuth, controller.getDocumentRatings);
router.get('/documents/:id/stats', requireAuth, controller.getRatingStats);

// Rating management
router.delete('/:id', requireAuth, controller.deleteRating);

export default router;
