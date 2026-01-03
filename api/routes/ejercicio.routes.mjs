import { Router } from 'express';
import ejercicioController from '../controllers/ejercicio.controller.mjs';
import { authenticateApi } from '../middlewares/auth.api.mjs';

const router = Router();

router.get('/', authenticateApi, ejercicioController.getAllEjercicios);
router.post('/', authenticateApi, ejercicioController.createEjercicio);



export default router;