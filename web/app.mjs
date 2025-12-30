import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Importación de rutas
import viewRoutes from './routes/views.routes.mjs';
import authRoutes from './routes/auth.routes.mjs';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolución de rutas absolutas para evitar errores en Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CONFIGURACIÓN DEL MOTOR DE PLANTILLAS (EJS)
 * path.join asegura que la ruta sea: C:\...\toji\web\views
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * MIDDLEWARES GLOBALES
 */
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Procesar datos de formularios y JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manejo de cookies (imprescindible para la sesión de Firebase)
app.use(cookieParser());

/**
 * DEFINICIÓN DE RUTAS
 */
// Rutas de lógica (API)
app.use('/api/auth', authRoutes);

// Rutas de visualización (Vistas)
app.use('/', viewRoutes);

/**
 * MANEJO DE ERRORES (404)
 * Se ejecuta si ninguna de las rutas anteriores coincide
 */
app.use((req, res) => {
    res.status(404).render('completes/index', { 
        title: 'Toji - 404 No encontrado' 
    });
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🥷  PROYECTO TOJI - SERVIDOR ACTIVO`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📂 Directorio Raíz: ${__dirname}`);
    console.log(`=========================================`);
});