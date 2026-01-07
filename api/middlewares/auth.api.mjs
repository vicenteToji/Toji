import { auth } from '../services/firebase.mjs';

export const authenticateApi = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'No autenticado. Token no proporcionado.' 
            });
        }

        const idToken = authHeader.split('Bearer ')[1];
        
        const decodedToken = await auth.verifyIdToken(idToken);
        
        req.user = decodedToken;
        next();
        
    } catch (error) {
        console.error('Error de autenticación API:', error.message);
        
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ 
                error: 'Token expirado. Por favor inicia sesión nuevamente.' 
            });
        }
        
        return res.status(401).json({ 
            error: 'Token inválido. Por favor inicia sesión.' 
        });
    }
};