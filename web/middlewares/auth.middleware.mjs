import { auth } from '../services/firebase.mjs';

export const isAuthenticated = async (req, res, next) => {
    const idToken = req.cookies.idToken;

    if (!idToken) {
        return res.redirect('/login');
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token inválido o expirado:', error.message);
        res.clearCookie('idToken');
        res.redirect('/login');
    }
};