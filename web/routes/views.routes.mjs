import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.mjs';
import authController from '../controllers/auth.controller.mjs';

const router = Router();

router.get('/', (req, res) => {
    res.render('completes/index', { title: 'Toji - Home' });
});

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/ejercicios', isAuthenticated, (req, res) => {
    res.render('completes/ejercicios', { title: 'Mis Ejercicios' });
});

router.get('/ejercicios/nuevo', isAuthenticated, (req, res) => {
    res.render('completes/nuevo-ejercicio', { title: 'Añadir Ejercicio' });
});

router.get('/rutinas', isAuthenticated, (req, res) => {
    res.render('completes/rutinas', { title: 'Mis Rutinas' });
});

router.get('/rutinas/nueva', isAuthenticated, (req, res) => {
    res.render('completes/nueva-rutina', { title: 'Nueva Rutina' });
});

router.get('/rutinas', isAuthenticated, (req, res) => {
    res.render('completes/rutinas', { title: 'Mis Rutinas' });
});

export default router;