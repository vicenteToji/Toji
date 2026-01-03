import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.mjs';

const router = Router();

router.get('/', (req, res) => {
    res.render('completes/index', { title: 'Toji - Home' });
});

router.get('/login', (req, res) => {
    res.render('completes/login', { title: 'Iniciar Sesión' });
});

router.get('/ejercicios', isAuthenticated, (req, res) => {
    res.render('completes/ejercicios', { title: 'Mis Ejercicios' });
});

router.get('/ejercicios/nuevo', isAuthenticated, (req, res) => {
    res.render('completes/nuevo-ejercicio', { title: 'Añadir Técnica' });
});

export default router;