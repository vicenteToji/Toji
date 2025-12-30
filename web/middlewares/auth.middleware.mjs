import { auth } from '../services/firebase.mjs';

export const checkAuth = async (req, res, next) => {
    const sessionCookie = req.cookies.session || '';

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;
        next();
    } catch (error) {
        res.redirect('/login');
    }
};