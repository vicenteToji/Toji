import { Router } from 'express';
import ejercicioController from '../controllers/ejercicio.controller.mjs';

const router = Router();

// Esto responde a: GET http://localhost:4000/api/ejercicios/
router.get('/', ejercicioController.getAllEjercicios);

// Esto responde a: POST http://localhost:4000/api/ejercicios/
router.post('/', ejercicioController.createEjercicio);

export default router;