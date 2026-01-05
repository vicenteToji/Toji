import { supabase } from '../config/supabase.mjs';
import Rutina from '../models/Rutina.mjs';
import ejercicioRepository from './ejercicio.repository.mjs';

const rutinaRepository = {};

rutinaRepository.findAllByUser = async (userId) => {
    const { data: rutinas, error } = await supabase
        .from('rutinas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const rutinasCompletas = [];

    for (const rutina of rutinas) {
        const { data: relaciones } = await supabase
            .from('rutina_ejercicios')
            .select('ejercicio_id')
            .eq('rutina_id', rutina.id);

        const ejercicioIds = relaciones ? relaciones.map(r => r.ejercicio_id) : [];

        const ejercicios = [];
        for (const ejId of ejercicioIds) {
            const ejercicio = await ejercicioRepository.findById(ejId, userId);
            if (ejercicio) ejercicios.push(ejercicio);
        }

        rutinasCompletas.push(new Rutina(
            rutina.id,
            rutina.nombre,
            rutina.descripcion,
            ejercicios
        ));
    }

    return rutinasCompletas;
};

rutinaRepository.create = async (rutinaData, ejercicioIds, userId) => {
    const { nombre, descripcion } = rutinaData;

    const { data, error } = await supabase
        .from('rutinas')
        .insert([{ nombre, descripcion, user_id: userId }])
        .select()
        .single();

    if (error) throw new Error(`Error al crear rutina: ${error.message}`);

    const rutinaId = data.id;

    if (ejercicioIds && ejercicioIds.length > 0) {
        const uniqueEjercicioIds = [...new Set(ejercicioIds)];

        const { data: existentes } = await supabase
            .from('rutina_ejercicios')
            .select('ejercicio_id')
            .eq('rutina_id', rutinaId)
            .in('ejercicio_id', uniqueEjercicioIds);

        const existentesIds = existentes ? existentes.map(r => r.ejercicio_id) : [];

        const nuevasRelaciones = uniqueEjercicioIds
            .filter(ejId => !existentesIds.includes(ejId))
            .map(ejId => ({
                rutina_id: rutinaId,
                ejercicio_id: ejId
            }));

        if (nuevasRelaciones.length > 0) {
            const { error: errorRel } = await supabase
                .from('rutina_ejercicios')
                .insert(nuevasRelaciones);

            if (errorRel) throw new Error(`Error al asociar ejercicios: ${errorRel.message}`);
        }
    }

    const ejercicios = [];
    for (const ejId of (ejercicioIds || [])) {
        const ej = await ejercicioRepository.findById(ejId, userId);
        if (ej) ejercicios.push(ej);
    }

    return new Rutina(rutinaId, nombre, descripcion, ejercicios);
};

export default rutinaRepository;