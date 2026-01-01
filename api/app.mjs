import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import ejercicioRoutes from './routes/ejercicio.routes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.API_PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/ejercicios', ejercicioRoutes);

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        server: 'Toji API REST',
        time: new Date().toLocaleTimeString() 
    });
});


app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado en la API de Toji' });
});

app.listen(PORT, () => {
       console.log(` servidor en ${PORT}`);
});