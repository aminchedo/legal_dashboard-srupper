import { Router } from 'express';
import * as controller from '@controllers/ocr.controller';

const router = Router();

// OCR processing endpoints
router.post('/process', controller.processSingle);
router.post('/process-and-save', controller.processAndSave);
router.post('/batch-process', controller.batchProcess);

// OCR job management
router.get('/jobs/:id', controller.jobStatus);
router.get('/quality-metrics/:id', controller.qualityMetrics);

// OCR service information
router.get('/models', controller.models);
router.get('/status', controller.status);

export default router;


