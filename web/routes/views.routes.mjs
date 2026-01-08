import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.mjs';

const router = Router();

router.get('/', isAuthenticated, (req, res) => {
    res.render('completes/index', { title: 'Toji - Home' });
});

router.get('/login', (req, res) => {
    res.render('completes/login', { title: 'Iniciar Sesión' });
});

router.get('/registro', (req, res) => {
  res.render('completes/registro', { title: 'Registrarse' });
});

router.get('/ejercicios', isAuthenticated, (req, res) => {
    res.render('completes/ejercicios', { title: 'Mis Ejercicios' });
});

router.get('/ejercicios/nuevo', isAuthenticated, (req, res) => {
    res.render('completes/nuevo-ejercicio', { title: 'Añadir Técnica' });
});

router.get('/ejercicios/editar/:id', isAuthenticated, async (req, res) => {
    const ejercicioId = req.params.id;
    const idToken = req.cookies.idToken;

    try {
        const apiRes = await fetch(`http://localhost:4000/api/ejercicios/${ejercicioId}`, {
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (!apiRes.ok) {
            return res.status(apiRes.status).send(`
                <h1>Ejercicio no encontrado</h1>
                <p>El ejercicio no existe o no te pertenece.</p>
                <a href="/ejercicios">Volver a mis ejercicios</a>
            `);
        }

        const ejercicio = await apiRes.json();

        res.render('completes/editar-ejercicio', { title: 'Editar Ejercicio', ejercicio });
    } catch (err) {
        res.status(500).send(`
            <h1>Error del servidor</h1>
            <p>No se pudo cargar el ejercicio.</p>
            <a href="/ejercicios">Volver</a>
        `);
    }
});

router.get('/rutinas', isAuthenticated, (req, res) => {
    res.render('completes/rutinas', { title: 'Mis Rutinas' });
});

router.get('/rutinas/nueva', isAuthenticated, (req, res) => {
    res.render('completes/nueva-rutina', { title: 'Nueva Rutina' });
});

router.get('/rutinas/editar/:id', isAuthenticated, async (req, res) => {
    const rutinaId = req.params.id;

    try {
        const apiRes = await fetch('http://localhost:3000/api/rutinas', {
            headers: { 'Cookie': req.headers.cookie || '' }
        });

        if (!apiRes.ok) throw new Error('Error al cargar rutinas');

        const rutinas = await apiRes.json();
        const rutina = rutinas.find(r => r.id == rutinaId);

        if (!rutina) {
            return res.status(404).send(`
                <h1>Rutina no encontrada</h1>
                <p>La rutina no existe o no te pertenece.</p>
                <a href="/rutinas">Volver a mis rutinas</a>
            `);
        }

        res.render('completes/editar-rutina', { title: 'Editar Rutina', rutina });
    } catch (err) {
        res.status(500).send('<h1>Error del servidor</h1><a href="/rutinas">Volver</a>');
    }
});

router.get('/entrenamiento/:id', isAuthenticated, async (req, res) => {
    const rutinaId = req.params.id;

    try {
        const apiRes = await fetch('http://localhost:3000/api/rutinas', {
            headers: { 'Cookie': req.headers.cookie || '' }
        });

        if (!apiRes.ok) throw new Error('Error al cargar rutinas');

        const rutinas = await apiRes.json();
        const rutina = rutinas.find(r => r.id == rutinaId);

        if (!rutina) {
            return res.status(404).render('completes/error', { 
                message: 'Rutina no encontrada o no te pertenece' 
            });
        }

        res.render('completes/entrenamiento', { 
            title: `Entrenamiento: ${rutina.nombre}`, 
            rutina 
        });
    } catch (err) {
        console.error('Error al cargar entrenamiento:', err);
        res.status(500).render('completes/error', { message: 'Error del servidor' });
    }
});

router.get('/perfil', isAuthenticated, (req, res) => {
  res.render('completes/perfil');
});

export default router;