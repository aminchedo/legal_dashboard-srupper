import { Router } from 'express';
import * as controller from '@controllers/documents.controller';

const router = Router();

// Main document routes
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

// Document version routes
router.get('/:id/versions', controller.versions);
router.get('/:id/versions/:version', controller.getVersion);
router.post('/:id/versions/:version/revert', controller.revertToVersion);

// Document search and metadata routes
router.get('/search', controller.search);
router.get('/categories', controller.categories);
router.get('/sources', controller.sources);

export default router;


