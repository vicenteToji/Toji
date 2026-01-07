import rutinaRepository from '../repositories/rutina.repository.mjs';
import { supabase } from '../config/supabase.mjs';

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
        const nuevaRutina = await rutinaRepository.create({ nombre, descripcion }, ejercicios, userId);
        res.status(201).json({ message: 'Rutina creada con éxito', data: nuevaRutina });
    } catch (error) {
        console.error('Error al crear rutina:', error.message);
        res.status(500).json({ error: 'Error al guardar la rutina' });
    }
};

const updateRutina = async (req, res) => {
    const userId = req.user?.uid;
    const rutinaId = parseInt(req.params.id);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const { nombre, descripcion, ejercicios } = req.body;
    if (!nombre || !ejercicios || !Array.isArray(ejercicios) || ejercicios.length === 0) {
        return res.status(400).json({ error: 'Nombre y al menos un ejercicio son obligatorios' });
    }

    try {
        if (!await rutinaRepository.findById(rutinaId, userId)) {
            return res.status(404).json({ error: 'Rutina no encontrada o no te pertenece' });
        }

        await supabase.from('rutinas').update({ nombre, descripcion }).eq('id', rutinaId).eq('user_id', userId);
        await supabase.from('rutina_ejercicios').delete().eq('rutina_id', rutinaId);

        const relaciones = ejercicios.map(ejId => ({ rutina_id: rutinaId, ejercicio_id: ejId }));
        await supabase.from('rutina_ejercicios').insert(relaciones);

        const rutinaActualizada = await rutinaRepository.findById(rutinaId, userId);
        res.status(200).json({ message: 'Rutina actualizada con éxito', data: rutinaActualizada });
    } catch (error) {
        console.error('Error al actualizar rutina:', error.message);
        res.status(500).json({ error: 'Error al actualizar la rutina' });
    }
};

const deleteRutina = async (req, res) => {
    const userId = req.user?.uid;
    const rutinaId = parseInt(req.params.id);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    try {
        if (!await rutinaRepository.findById(rutinaId, userId)) {
            return res.status(404).json({ error: 'Rutina no encontrada o no te pertenece' });
        }

        await supabase.from('rutina_ejercicios').delete().eq('rutina_id', rutinaId);
        await supabase.from('rutinas').delete().eq('id', rutinaId).eq('user_id', userId);

        res.status(200).json({ message: 'Rutina eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar rutina:', error.message);
        res.status(500).json({ error: 'Error al eliminar la rutina' });
    }
};

export default { getAllRutinas, createRutina, updateRutina, deleteRutina };