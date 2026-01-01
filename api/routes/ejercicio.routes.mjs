import { Router } from 'express';
import ejercicioController from '../controllers/ejercicio.controller.mjs';

const router = Router();

router.get('/', ejercicioController.getAll);

router.get('/:id', ejercicioController.getById);

export default router;