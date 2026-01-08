import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch';
import { auth } from './services/firebase.mjs';
import { authenticate } from './services/firebase.mjs'; 
import viewRoutes from './routes/views.routes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  if (req.cookies.idToken) {
    try {
      const decodedToken = await auth.verifyIdToken(req.cookies.idToken);
      res.locals.user = {
        id: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Usuario'
      };
    } catch (error) {
      console.error('Token inválido o expirado:', error);
      res.clearCookie('idToken');
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

app.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, error: 'Token no proporcionado' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);

    res.cookie('idToken', idToken, {
      maxAge: 60 * 60 * 24 * 5 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ success: true, redirect: '/ejercicios', uid: decodedToken.uid });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({ success: false, error: 'Autenticación fallida: ' + error.message });
  }
});

app.post('/registro', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, error: 'Token no proporcionado' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);

    res.cookie('idToken', idToken, {
      maxAge: 60 * 60 * 24 * 5 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ success: true, redirect: '/login', uid: decodedToken.uid });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(401).json({ success: false, error: 'Registro fallido: ' + error.message });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('idToken');
  res.redirect('/login');
});

app.get('/api/ejercicios', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch('http://localhost:4000/api/ejercicios', {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente GET ejercicios:', err.message);
    res.status(500).json({ error: 'Error al cargar ejercicios' });
  }
});

app.post('/api/ejercicios', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch('http://localhost:4000/api/ejercicios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente POST ejercicios:', err.message);
    res.status(500).json({ error: 'Error al crear ejercicio' });
  }
});

app.put('/api/ejercicios/:id', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch(`http://localhost:4000/api/ejercicios/${req.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente PUT ejercicio:', err.message);
    res.status(500).json({ error: 'Error al actualizar ejercicio' });
  }
});

app.delete('/api/ejercicios/:id', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch(`http://localhost:4000/api/ejercicios/${req.params.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente DELETE ejercicio:', err.message);
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
  }
});

app.get('/api/rutinas', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch('http://localhost:4000/api/rutinas', {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente GET rutinas:', err.message);
    res.status(500).json({ error: 'Error al cargar rutinas' });
  }
});

app.post('/api/rutinas', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch('http://localhost:4000/api/rutinas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente POST rutinas:', err.message);
    res.status(500).json({ error: 'Error al crear rutina' });
  }
});

app.put('/api/rutinas/:id', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch(`http://localhost:4000/api/rutinas/${req.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente PUT rutina:', err.message);
    res.status(500).json({ error: 'Error al actualizar rutina' });
  }
});

app.delete('/api/rutinas/:id', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch(`http://localhost:4000/api/rutinas/${req.params.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente DELETE rutina:', err.message);
    res.status(500).json({ error: 'Error al eliminar rutina' });
  }
});

app.post('/api/entrenamientos/guardar', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch('http://localhost:4000/api/entrenamientos/guardar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente POST entrenamientos/guardar:', err.message);
    res.status(500).json({ error: 'Error al guardar entrenamiento' });
  }
});

app.get('/api/entrenamientos', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch('http://localhost:4000/api/entrenamientos', {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente GET entrenamientos:', err.message);
    res.status(500).json({ error: 'Error al cargar entrenamientos' });
  }
});

app.get('/api/estadisticas/series-por-semana', authenticate, async (req, res) => {
  const idToken = req.cookies.idToken;
  try {
    const apiRes = await fetch('http://localhost:4000/api/estadisticas/series-por-semana', {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Error puente GET estadísticas:', err.message);
    res.status(500).json({ error: 'Error al cargar estadísticas' });
  }
});

app.use('/', viewRoutes);

app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Página no encontrada</h1>
    <p>Vuelve al <a href="/">inicio</a></p>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor web en puerto ${PORT}`);
});