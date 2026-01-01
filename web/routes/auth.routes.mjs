import { Router } from 'express';
import authController from '../controllers/auth.controller.mjs';
import { authValidationRules, validate } from '../middlewares/validator.middleware.mjs';

const router = Router();

router.post('/session-login', 
    authValidationRules, 
    validate, 
    authController.sessionLogin
);

router.get('/logout', authController.logout);

export default router;