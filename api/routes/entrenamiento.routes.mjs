import { Router } from 'express';
import entrenamientoController from '../controllers/entrenamiento.controller.mjs';
import { authenticateApi } from '../middlewares/auth.api.mjs';

const router = Router();

router.post('/guardar', authenticateApi, entrenamientoController.guardarEntrenamiento);
router.get('/', authenticateApi, entrenamientoController.getAllEntrenamientos);

export default router;