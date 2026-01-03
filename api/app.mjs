import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ejercicioRoutes from './routes/ejercicio.routes.mjs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ejercicios', ejercicioRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado en la API de Toji' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 API de Toji lista en puerto ${PORT}`);
});