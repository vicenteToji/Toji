import { auth } from '../services/firebase.mjs';

const authController = {};

authController.sessionLogin = async (req, res) => {
    const { idToken } = req.body;
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    try {
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

        const options = {
            maxAge: expiresIn,
            httpOnly: true, 
            secure: false,  
            sameSite: 'lax' 
        };

        res.cookie('__session', sessionCookie, options);

        res.status(200).json({ status: 'success' });

    } catch (error) {
        console.error('Error al crear la sesión en Toji:', error);
        res.status(401).json({ status: 'error', message: 'No se pudo autorizar la sesión.' });
    }
};

authController.logout = (req, res) => {
    res.clearCookie('__session');
    res.redirect('/login');
};

export default authController;