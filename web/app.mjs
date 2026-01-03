import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch';
import './services/firebase.mjs'; 
import viewRoutes from './routes/views.routes.mjs';
import { isAuthenticated } from './middlewares/auth.middleware.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/ejercicios', isAuthenticated, async (req, res) => {
    const idToken = req.cookies.idToken;

    console.log(' [PUENTE GET] Usuario autenticado, intentando cargar ejercicios');
    console.log('   Cookie idToken presente:', !!idToken);

    if (!idToken) {
        console.warn('   No hay idToken en la cookie');
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        console.log('    Enviando petición a la API real...');
        const apiResponse = await fetch('http://localhost:4000/api/ejercicios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`   Respuesta de la API: ${apiResponse.status} ${apiResponse.statusText}`);

        const data = await apiResponse.json();
        console.log('   Datos recibidos de la API:', data);

        if (!apiResponse.ok) {
            console.error('   Error de la API:', data);
            return res.status(apiResponse.status).json(data);
        }

        console.log('   Enviando ejercicios al frontend');
        res.status(200).json(data);

    } catch (error) {
        console.error('  Error crítico en puente GET:', error.message);
        res.status(500).json({ error: 'Error interno al conectar con la API' });
    }
});


app.post('/api/ejercicios', isAuthenticated, async (req, res) => {
    const idToken = req.cookies.idToken;

    console.log(' [PUENTE POST] Intentando crear ejercicio');
    console.log('   Datos recibidos:', req.body);

    if (!idToken) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const apiResponse = await fetch('http://localhost:4000/api/ejercicios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await apiResponse.json();
        console.log(`   Respuesta API POST: ${apiResponse.status}`, data);

        res.status(apiResponse.status).json(data);

    } catch (error) {
        console.error('   Error en puente POST:', error.message);
        res.status(500).json({ error: 'Error al crear ejercicio' });
    }
});


app.use('/', viewRoutes);

app.use((req, res) => {
    res.status(404).render('completes/404', { title: 'Página no encontrada' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ${PORT}`);
});