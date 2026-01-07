import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!admin.apps.length) {
    try {
        const serviceAccountPath = path.join(__dirname, '../../firebase-credentials.json');
        
        let credential;
        
        try {
            const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
            credential = admin.credential.cert(serviceAccount);
            console.log('Credenciales Firebase cargadas desde archivo JSON');
        } catch (fileError) {
            console.log('No se encontró archivo JSON, usando variables de entorno');
            
            const serviceAccount = {
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
            };
            
            credential = admin.credential.cert(serviceAccount);
        }

        admin.initializeApp({
            credential: credential
        });

        console.log('Firebase Admin inicializado correctamente (solo Auth)');
        
    } catch (error) {
        console.error('Error al inicializar Firebase Admin:', error.message);
        console.error('Detalles:', error);
        process.exit(1);
    }
}

export const auth = admin.auth();

export const authenticate = async (req, res, next) => {
    try {
        const idToken = req.cookies.idToken;
        
        if (!idToken) {
            return res.status(401).json({ 
                error: 'No autenticado. Por favor inicia sesión.' 
            });
        }

        const decodedToken = await auth.verifyIdToken(idToken);

        req.user = decodedToken;
        
        next();
        
    } catch (error) {
        console.error('Error de autenticación:', error.message);
        
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