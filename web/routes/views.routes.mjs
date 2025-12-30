import { Router } from 'express';
import viewsController from '../controllers/views.controller.mjs';
import { checkAuth } from '../middlewares/auth.middleware.mjs';

const router = Router();

router.get('/login', viewsController.renderLogin);
router.get('/', checkAuth, viewsController.renderHome);
router.get('/rutinas', checkAuth, viewsController.renderRutinas);
router.get('/ejercicios', checkAuth, viewsController.renderEjercicios);
router.get('/perfil', checkAuth, viewsController.renderPerfil);

export default router;