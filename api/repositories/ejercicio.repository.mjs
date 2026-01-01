import { supabase } from '../config/supabase.mjs';
import Ejercicio from '../models/Ejercicio.mjs';

const ejercicioRepository = {};

ejercicioRepository.findAll = async () => {
    const { data, error } = await supabase
        .from('ejercicios')
        .select('*');

    if (error) {
        throw new Error(`Error en el repositorio al buscar ejercicios: ${error.message}`);
    }

    return data.map(item => new Ejercicio(
        item.id,
        item.nombre,
        item.grupo_muscular, 
        item.descripcion,
        item.equipo
    ));
};

ejercicioRepository.findById = async (id) => {
    const { data, error } = await supabase
        .from('ejercicios')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;

    return new Ejercicio(
        data.id,
        data.nombre,
        data.grupo_muscular,
        data.descripcion,
        data.equipo
    );
};

export default ejercicioRepository;