import { supabase } from '../config/supabase.mjs';
import Ejercicio from '../models/Ejercicio.mjs';

const findAllByUser = async (userId) => {
    const { data, error } = await supabase.from('ejercicios').select('*').eq('user_id', userId);
    if (error) throw new Error(`Error al buscar ejercicios: ${error.message}`);
    return data.map(ej => new Ejercicio(ej.id, ej.nombre, ej.grupo_muscular, ej.descripcion, ej.equipo));
};

const findById = async (id, userId) => {
    const { data, error } = await supabase.from('ejercicios').select('*').eq('id', id).eq('user_id', userId).single();
    if (error || !data) return null;
    return new Ejercicio(data.id, data.nombre, data.grupo_muscular, data.descripcion, data.equipo);
};

const create = async (ejercicioData, userId) => {
    const { nombre, grupo_muscular, descripcion, equipo } = ejercicioData;
    const { data, error } = await supabase.from('ejercicios').insert([{ nombre, grupo_muscular, descripcion, equipo, user_id: userId }]).select().single();
    if (error) throw new Error(`Error al crear ejercicio: ${error.message}`);
    return new Ejercicio(data.id, data.nombre, data.grupo_muscular, data.descripcion, data.equipo);
};

const update = async (ejercicioId, ejercicioData, userId) => {
    const { data, error } = await supabase.from('ejercicios').update(ejercicioData).eq('id', ejercicioId).eq('user_id', userId).select().single();
    if (error) throw new Error(`Error al actualizar: ${error.message}`);
    if (!data) throw new Error('Ejercicio no encontrado');
    return new Ejercicio(data.id, data.nombre, data.grupo_muscular, data.descripcion, data.equipo);
};

const deleteEj = async (ejercicioId, userId) => {
    const { data, error } = await supabase.from('ejercicios').delete().eq('id', ejercicioId).eq('user_id', userId);
    if (error) throw new Error(`Error al eliminar: ${error.message}`);
    if (!data || data.length === 0) throw new Error('Ejercicio no encontrado');
};

export default { findAllByUser, findById, create, update, delete: deleteEj };