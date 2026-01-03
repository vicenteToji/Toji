import { supabase } from '../config/supabase.mjs';
import Ejercicio from '../models/Ejercicio.mjs';

const ejercicioRepository = {};

ejercicioRepository.findAllByUser = async (userId) => {
    const { data, error } = await supabase
        .from('ejercicios')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        throw new Error(`Error en el repositorio al buscar ejercicios del usuario: ${error.message}`);
    }

    return data.map(item => new Ejercicio(
        item.id,
        item.nombre,
        item.grupo_muscular, 
        item.descripcion,
        item.equipo
    ));
};

ejercicioRepository.create = async (ejercicioData, userId) => {
    const dataToInsert = { ...ejercicioData, user_id: userId };

    const { data, error } = await supabase
        .from('ejercicios')
        .insert([dataToInsert])
        .select();

    if (error) {
        throw new Error(`Error en el repositorio al crear ejercicio: ${error.message}`);
    }

    return new Ejercicio(
        data[0].id,
        data[0].nombre,
        data[0].grupo_muscular,
        data[0].descripcion,
        data[0].equipo
    );
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

export default ejercicioRepository;