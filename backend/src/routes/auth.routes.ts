import { Router } from 'express';
import * as controller from '@controllers/auth.controller';

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refreshToken);
router.post('/logout', controller.logout);
router.get('/me', controller.me);
router.put('/change-password', controller.changePassword);
router.get('/users', controller.listUsers);
router.get('/health', controller.health);

export default router;


