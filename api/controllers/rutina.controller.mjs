import rutinaRepository from '../repositories/rutina.repository.mjs';

const getAllRutinas = async (req, res) => {
    const userId = req.user?.uid;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    try {
        const rutinas = await rutinaRepository.findAllByUser(userId);
        res.status(200).json(rutinas);
    } catch (error) {
        console.error('Error al obtener rutinas:', error.message);
        res.status(500).json({ error: 'Error al obtener rutinas' });
    }
};

const createRutina = async (req, res) => {
    const userId = req.user?.uid;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const { nombre, descripcion, ejercicios } = req.body;

    if (!nombre || !ejercicios || !Array.isArray(ejercicios) || ejercicios.length === 0) {
        return res.status(400).json({ error: 'Nombre y al menos un ejercicio son obligatorios' });
    }

    try {
        const nuevaRutina = await rutinaRepository.create(
            { nombre, descripcion },
            ejercicios,
            userId
        );

        res.status(201).json({
            success: true,
            message: 'Rutina creada con éxito',
            data: nuevaRutina
        });
    } catch (error) {
        console.error('Error al crear rutina:', error.message);
        res.status(500).json({ error: 'Error al guardar la rutina' });
    }
};

export default {
    getAllRutinas,
    createRutina
};