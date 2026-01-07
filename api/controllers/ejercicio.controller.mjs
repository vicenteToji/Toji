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

const getEjercicioById = async (req, res) => {
    const userId = req.user?.uid;
    const ejercicioId = parseInt(req.params.id);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    try {
        const ejercicio = await ejercicioRepository.findById(ejercicioId, userId);
        if (!ejercicio) return res.status(404).json({ error: 'Ejercicio no encontrado o no te pertenece' });
        res.status(200).json(ejercicio);
    } catch (error) {
        console.error('Error al obtener ejercicio por ID:', error.message);
        res.status(500).json({ error: 'Error al obtener el ejercicio' });
    }
};

const createEjercicio = async (req, res) => {
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const { nombre, grupo_muscular, descripcion, equipo } = req.body;
    if (!nombre || !grupo_muscular) return res.status(400).json({ error: 'Nombre y Grupo Muscular son obligatorios' });

    try {
        const nuevoEjercicio = await ejercicioRepository.create({ nombre, grupo_muscular, descripcion, equipo }, userId);
        res.status(201).json({ message: 'Ejercicio creado con éxito', data: nuevoEjercicio });
    } catch (error) {
        console.error('Error al crear ejercicio:', error.message);
        res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }
};

const updateEjercicio = async (req, res) => {
    const userId = req.user?.uid;
    const ejercicioId = parseInt(req.params.id);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const { nombre, grupo_muscular, descripcion, equipo } = req.body;
    if (!nombre || !grupo_muscular) return res.status(400).json({ error: 'Nombre y Grupo Muscular son obligatorios' });

    try {
        const ejercicioActualizado = await ejercicioRepository.update(ejercicioId, { nombre, grupo_muscular, descripcion, equipo }, userId);
        res.status(200).json({ message: 'Ejercicio actualizado con éxito', data: ejercicioActualizado });
    } catch (error) {
        console.error('Error al actualizar ejercicio:', error.message);
        if (error.message.includes('no encontrado')) return res.status(404).json({ error: 'Ejercicio no encontrado o no te pertenece' });
        res.status(500).json({ error: 'Error al actualizar el ejercicio' });
    }
};

const deleteEjercicio = async (req, res) => {
    const userId = req.user?.uid;
    const ejercicioId = parseInt(req.params.id);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    try {
        await ejercicioRepository.delete(ejercicioId, userId);
        res.status(200).json({ message: 'Ejercicio eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar ejercicio:', error.message);
        if (error.message.includes('no encontrado')) return res.status(404).json({ error: 'Ejercicio no encontrado o no te pertenece' });
        res.status(500).json({ error: 'Error al eliminar el ejercicio' });
    }
};

export default { getAllEjercicios, getEjercicioById, createEjercicio, updateEjercicio, deleteEjercicio };