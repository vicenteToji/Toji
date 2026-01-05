import { Router } from 'express';
import rutinaController from '../controllers/rutina.controller.mjs';
import { authenticateApi } from '../middlewares/auth.api.mjs';

const router = Router();

router.get('/', authenticateApi, rutinaController.getAllRutinas);
router.post('/', authenticateApi, rutinaController.createRutina);

export default router;