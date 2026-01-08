import { auth } from '../services/firebase.mjs';

export const isAuthenticated = async (req, res, next) => {
  const idToken = req.cookies.idToken;

  if (!idToken) {
    return res.redirect('/login');
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    res.locals.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Usuario'
    };

    next();
  } catch (error) {
    console.error('Token inválido o expirado:', error);
    res.clearCookie('idToken');
    return res.redirect('/login');
  }
};