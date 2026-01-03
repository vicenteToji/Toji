import { auth } from '../../web/services/firebase.mjs'; 

export const authenticateApi = async (req, res, next) => {
    let idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'Token de autorización requerido' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;  
        next();
    } catch (error) {
        console.error('Error verificando token en API:', error.message);
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};