import { supabase } from '../config/supabase.mjs';
import Ejercicio from '../models/Ejercicio.mjs';

const ejercicioRepository = {};

ejercicioRepository.findAllByUser = async (userId) => {
    const { data, error } = await supabase
        .from('ejercicios')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        throw new Error(`Error en el repositorio al buscar ejercicios: ${error.message}`);
    }

    return data.map(ej => new Ejercicio(
        ej.id,
        ej.nombre,
        ej.grupo_muscular,
        ej.descripcion,
        ej.equipo
    ));
};

ejercicioRepository.findById = async (id, userId) => {
    const { data, error } = await supabase
        .from('ejercicios')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (error || !data) return null;

    return new Ejercicio(
        data.id,
        data.nombre,
        data.grupo_muscular,
        data.descripcion,
        data.equipo
    );
};

ejercicioRepository.create = async (ejercicioData, userId) => {
    const { nombre, grupo_muscular, descripcion, equipo } = ejercicioData;

    const { data, error } = await supabase
        .from('ejercicios')
        .insert([{
            nombre,
            grupo_muscular,
            descripcion,
            equipo,
            user_id: userId
        }])
        .select()
        .single();

    if (error) {
        throw new Error(`Error en el repositorio al crear ejercicio: ${error.message}`);
    }

    if (!data) {
        throw new Error('No se devolvió el ejercicio creado');
    }

    return new Ejercicio(
        data.id,
        data.nombre,
        data.grupo_muscular,
        data.descripcion,
        data.equipo
    );
};

export default ejercicioRepository;