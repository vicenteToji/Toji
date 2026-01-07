import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ejercicioRoutes from './routes/ejercicio.routes.mjs';
import rutinaRoutes from './routes/rutina.routes.mjs';
import entrenamientoRoutes from './routes/entrenamiento.routes.mjs';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());


app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/entrenamientos', entrenamientoRoutes); 


app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado en la API de Toji' });
});

const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
    console.log(`API en:${PORT}`);
});