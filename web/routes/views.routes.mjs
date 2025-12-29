import { Router } from 'express';
import viewsController from '../controllers/views.controller.mjs';

const router = Router();

router.get('/', viewsController.renderHome);
router.get('/rutinas', viewsController.renderRutinas);
router.get('/ejercicios', viewsController.renderEjercicios);
router.get('/perfil', viewsController.renderPerfil); 
router.get('/login', viewsController.renderLogin);

export default router;