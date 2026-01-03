import admin from 'firebase-admin';

export const isAuthenticated = async (req, res, next) => {
    const sessionCookie = req.cookies.__session || '';

    if (!sessionCookie) {
        return res.redirect('/login');
    }

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        
        req.user = decodedClaims;

        next();
    } catch (error) {
        console.error('Sesión inválida:', error.message);
        res.clearCookie('__session');
        res.redirect('/login');
    }
};