import { Router } from 'express';
import authController from '../controllers/auth.controller.mjs';

const router = Router();
router.post('/session-login', 
    authController.sessionLogin
);

router.get('/logout', 
    authController.logout
);

export default router;