import { Router } from 'express';
import ejercicioController from '../controllers/ejercicio.controller.mjs';
import { authenticateApi } from '../middlewares/auth.api.mjs';

const router = Router();

router.get('/', authenticateApi, ejercicioController.getAllEjercicios);
router.get('/:id', authenticateApi, ejercicioController.getEjercicioById);
router.post('/', authenticateApi, ejercicioController.createEjercicio);
router.put('/:id', authenticateApi, ejercicioController.updateEjercicio);
router.delete('/:id', authenticateApi, ejercicioController.deleteEjercicio); 

export default router;