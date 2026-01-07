import { supabase } from '../config/supabase.mjs';
import Rutina from '../models/Rutina.mjs';
import ejercicioRepository from './ejercicio.repository.mjs';

const findAllByUser = async (userId) => {
    const { data: rutinas, error } = await supabase.from('rutinas').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    const rutinasCompletas = [];
    for (const rutina of rutinas) {
        const { data: relaciones } = await supabase.from('rutina_ejercicios').select('ejercicio_id').eq('rutina_id', rutina.id);
        const ejercicioIds = relaciones ? relaciones.map(r => r.ejercicio_id) : [];

        const ejercicios = [];
        for (const ejId of ejercicioIds) {
            const ej = await ejercicioRepository.findById(ejId, userId);
            if (ej) ejercicios.push(ej);
        }

        rutinasCompletas.push(new Rutina(rutina.id, rutina.nombre, rutina.descripcion, ejercicios));
    }
    return rutinasCompletas;
};

const findById = async (id, userId) => {
    const { data, error } = await supabase.from('rutinas').select('*').eq('id', id).eq('user_id', userId).single();
    if (error || !data) return null;

    const { data: relaciones } = await supabase.from('rutina_ejercicios').select('ejercicio_id').eq('rutina_id', id);
    const ejercicioIds = relaciones ? relaciones.map(r => r.ejercicio_id) : [];

    const ejercicios = [];
    for (const ejId of ejercicioIds) {
        const ej = await ejercicioRepository.findById(ejId, userId);
        if (ej) ejercicios.push(ej);
    }

    return new Rutina(data.id, data.nombre, data.descripcion, ejercicios);
};

const create = async (rutinaData, ejercicioIds, userId) => {
    const { nombre, descripcion } = rutinaData;
    const { data, error } = await supabase.from('rutinas').insert([{ nombre, descripcion, user_id: userId }]).select().single();
    if (error) throw new Error(`Error al crear rutina: ${error.message}`);

    const rutinaId = data.id;
    if (ejercicioIds && ejercicioIds.length > 0) {
        const uniqueEjercicioIds = [...new Set(ejercicioIds)];
        const relaciones = uniqueEjercicioIds.map(ejId => ({ rutina_id: rutinaId, ejercicio_id: ejId }));
        await supabase.from('rutina_ejercicios').insert(relaciones);
    }

    const ejercicios = [];
    for (const ejId of (ejercicioIds || [])) {
        const ej = await ejercicioRepository.findById(ejId, userId);
        if (ej) ejercicios.push(ej);
    }

    return new Rutina(rutinaId, nombre, descripcion, ejercicios);
};

export default { findAllByUser, findById, create };