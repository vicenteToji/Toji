import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch'; 
import './services/firebase.mjs'; 
import viewRoutes from './routes/views.routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// PUENTE: Recibe del navegador y envía a la API
app.post('/api/ejercicios', async (req, res) => {
    try {
        const apiRes = await fetch('http://localhost:4000/api/ejercicios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await apiRes.json();
        res.status(apiRes.status).json(data);
    } catch (err) {
        console.error("Error en puente Web-API:", err.message);
        res.status(500).json({ error: 'La API de Toji no responde' });
    }
});

app.use('/', viewRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Web de Toji en puerto ${PORT}`);
});