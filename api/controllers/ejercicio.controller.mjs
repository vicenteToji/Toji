import { supabase } from '../config/supabase.mjs';  
import Ejercicio from '../models/Ejercicio.mjs';

const getAllEjercicios = async (req, res) => {
    const userId = req.user?.uid;

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    try {
        const { data, error } = await supabase
            .from('ejercicios')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        const ejercicios = data.map(ej => new Ejercicio(
            ej.id,
            ej.nombre,
            ej.grupo_muscular,
            ej.descripcion,
            ej.equipo
        ));

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
        const { data, error } = await supabase
            .from('ejercicios')
            .select('*')
            .eq('id', ejercicioId)
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Ejercicio no encontrado o no te pertenece' });

        const ejercicio = new Ejercicio(
            data.id,
            data.nombre,
            data.grupo_muscular,
            data.descripcion,
            data.equipo
        );

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

    if (!nombre || !grupo_muscular) {
        return res.status(400).json({ error: 'Nombre y Grupo Muscular son obligatorios' });
    }

    try {
        const { data, error } = await supabase
            .from('ejercicios')
            .insert([{ nombre, grupo_muscular, descripcion, equipo, user_id: userId }])
            .select()
            .single();

        if (error) throw error;

        const nuevoEjercicio = new Ejercicio(
            data.id,
            data.nombre,
            data.grupo_muscular,
            data.descripcion,
            data.equipo
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

const updateEjercicio = async (req, res) => {
    const userId = req.user?.uid;
    const ejercicioId = parseInt(req.params.id);

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const { nombre, grupo_muscular, descripcion, equipo } = req.body;

    if (!nombre || !grupo_muscular) {
        return res.status(400).json({ error: 'Nombre y Grupo Muscular son obligatorios' });
    }

    try {
        const { data: existente, error: errorCheck } = await supabase
            .from('ejercicios')
            .select('id')
            .eq('id', ejercicioId)
            .eq('user_id', userId)
            .single();

        if (errorCheck || !existente) {
            return res.status(404).json({ error: 'Ejercicio no encontrado o no te pertenece' });
        }

        const { data, error } = await supabase
            .from('ejercicios')
            .update({ nombre, grupo_muscular, descripcion, equipo })
            .eq('id', ejercicioId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;

        const ejercicioActualizado = new Ejercicio(
            data.id,
            data.nombre,
            data.grupo_muscular,
            data.descripcion,
            data.equipo
        );

        res.status(200).json({
            message: 'Ejercicio actualizado con éxito',
            data: ejercicioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar ejercicio:', error.message);
        res.status(500).json({ error: 'Error al actualizar el ejercicio' });
    }
};

const deleteEjercicio = async (req, res) => {
    const userId = req.user?.uid;
    const ejercicioId = parseInt(req.params.id);

    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    try {
        const { data: ejercicio, error: errorCheck } = await supabase
            .from('ejercicios')
            .select('id')
            .eq('id', ejercicioId)
            .eq('user_id', userId)
            .single();

        if (errorCheck || !ejercicio) {
            return res.status(404).json({ error: 'Ejercicio no encontrado o no te pertenece' });
        }

        const { error } = await supabase
            .from('ejercicios')
            .delete()
            .eq('id', ejercicioId)
            .eq('user_id', userId);

        if (error) throw error;

        res.status(200).json({ message: 'Ejercicio eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar ejercicio:', error.message);
        res.status(500).json({ error: 'Error al eliminar el ejercicio' });
    }
};

export default {
    getAllEjercicios,
    getEjercicioById,
    createEjercicio,
    updateEjercicio,
    deleteEjercicio  
};

