import { Router } from 'express';
import * as controller from '@controllers/websocket.controller';

const router = Router();

router.get('/events', controller.info);

export default router;


