import { auth } from '../services/firebase.mjs';

const showLogin = (req, res) => {
    res.render('completes/login', { title: 'Iniciar Sesión', error: null });
};

const login = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.render('completes/login', {
            title: 'Iniciar Sesión',
            error: 'No se recibió el token de autenticación.'
        });
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const expiresIn = 60 * 60 * 24 * 7 * 1000; 

        res.cookie('idToken', idToken, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        res.cookie('userUid', uid, {
            maxAge: expiresIn,
            httpOnly: false, 
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        res.redirect('/ejercicios');
    } catch (error) {
        console.error('Error verificando token:', error.message);
        res.render('completes/login', {
            title: 'Iniciar Sesión',
            error: 'Credenciales inválidas o token expirado.'
        });
    }
};
const logout = (req, res) => {
    res.clearCookie('idToken');
    res.redirect('/login');
};

export default { showLogin, login, logout };