import { auth } from '../services/firebase.mjs';

export const isAuthenticated = async (req, res, next) => {
    let idToken = req.cookies.idToken;
    if (!idToken && req.headers.authorization?.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    }

    if (!idToken) {
        return res.render('completes/login', {
            title: 'Iniciar Sesión',
            error: 'Debes iniciar sesión para acceder a esta página.'
        });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken; 
        next();
    } catch (error) {
        console.error('Token inválido o expirado:', error.message);
        res.clearCookie('idToken');
        return res.render('completes/login', {
            title: 'Iniciar Sesión',
            error: 'Sesión expirada o inválida. Inicia sesión de nuevo.'
        });
    }
};