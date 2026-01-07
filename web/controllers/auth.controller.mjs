import { auth } from '../services/firebase.mjs';

const showLogin = (req, res) => {
    res.render('completes/login', { title: 'Iniciar Sesión' });
};

const login = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'No se recibió el token de autenticación' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const expiresIn = 60 * 60 * 24 * 7 * 1000; 

        res.cookie('idToken', idToken, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: false, 
            sameSite: 'lax',
            path: '/'
        });

        res.status(200).json({ success: true, redirect: '/ejercicios' });
    } catch (error) {
        console.error('Error verificando token:', error.message);
        res.status(401).json({ error: 'Credenciales inválidas o token expirado' });
    }
};

const logout = (req, res) => {
    res.clearCookie('idToken');
    res.redirect('/login');
};

export default { showLogin, login, logout };