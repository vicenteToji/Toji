import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


import viewRoutes from './routes/views.routes.mjs';
import authRoutes from './routes/auth.routes.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.use('/', viewRoutes);

app.use((req, res) => {
    res.status(404).render('completes/index', { 
        title: 'Toji - 404 No encontrado' 
    });
});

app.listen(PORT, () => {
    console.log(` servidor en ${PORT}`);

})