import ejercicioRepository from '../repositories/ejercicio.repository.mjs';

const getAllEjercicios = async (req, res) => {
    const userId = req.user?.uid;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    try {
        const ejercicios = await ejercicioRepository.findAllByUser(userId);
        res.status(200).json(ejercicios);
    } catch (error) {
        console.error('Error al obtener ejercicios:', error.message);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

const createEjercicio = async (req, res) => {
    const userId = req.user?.uid;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const { nombre, grupo_muscular, descripcion, equipo } = req.body;

    if (!nombre || !grupo_muscular) {
        return res.status(400).json({ error: 'Nombre y Grupo Muscular son obligatorios' });
    }

    try {
        const nuevoEjercicio = await ejercicioRepository.create(
            { nombre, grupo_muscular, descripcion, equipo },
            userId
        );

        res.status(201).json({
            message: 'Ejercicio creado con éxito',
            data: nuevoEjercicio
        });
    } catch (error) {
        console.error('Error al crear ejercicio:', error.message);
        res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }
};

export default {
    getAllEjercicios,
    createEjercicio
};