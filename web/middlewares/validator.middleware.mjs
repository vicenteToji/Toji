import { body, validationResult } from 'express-validator';

export const authValidationRules = [
    body('email')
        .isEmail()
        .withMessage('Debes introducir un correo electrónico válido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .trim()
];

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    

    return res.status(400).json({
        status: 'error',
        message: errors.array()[0].msg 
    });
};