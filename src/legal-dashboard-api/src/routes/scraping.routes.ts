import { Router } from 'express';
import * as controller from '@controllers/scraping.controller';

const router = Router();

// Job management
router.post('/start', controller.start);
router.get('/status', controller.status);
router.get('/status/:id', controller.statusById);
router.post('/stop/:id', controller.stopById);
router.post('/stop', controller.stopAll);

// Source management
router.get('/sources', controller.sources);
router.post('/sources', controller.createSource);

// Service status
router.get('/health', controller.health);
router.get('/stats', controller.health);

// Rotation
router.post('/rotate', controller.rotate);

export default router;


