import { supabase } from '../config/supabase.mjs';

const guardarEntrenamiento = async (req, res) => {
    const userId = req.user?.uid;
    const { rutina_id, notas, ejercicios } = req.body;

    if (!userId || !rutina_id || !ejercicios) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        const { data: entrenamiento, error: errorEnt } = await supabase
            .from('entrenamientos')
            .insert([{ rutina_id, user_id: userId, notas }])
            .select()
            .single();

        if (errorEnt) throw errorEnt;

        const entrenamientoId = entrenamiento.id;

        const seriesToInsert = [];
        ejercicios.forEach(ej => {
            ej.series.forEach((serie, index) => {
                if (serie.peso > 0 || serie.reps > 0) {
                    seriesToInsert.push({
                        entrenamiento_id: entrenamientoId,
                        ejercicio_id: ej.id,
                        serie_number: index + 1,
                        peso: serie.peso,
                        reps: serie.reps
                    });
                }
            });
        });

        if (seriesToInsert.length > 0) {
            const { error: errorSeries } = await supabase
                .from('series')
                .insert(seriesToInsert);

            if (errorSeries) throw errorSeries;
        }

        res.status(200).json({ message: 'Entrenamiento guardado con éxito' });
    } catch (error) {
        console.error('ERROR COMPLETO al guardar entrenamiento:', error);
        res.status(500).json({ error: 'Error al guardar el entrenamiento' });
    }
};

const getAllEntrenamientos = async (req, res) => {
    const userId = req.user?.uid;

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    try {
        console.log(`[INFO] Cargando entrenamientos para user_id: ${userId}`);

        const { data: entrenamientos, error: errorEntrenamientos } = await supabase
            .from('entrenamientos')
            .select(`
                id,
                fecha,
                notas,
                rutina_id,
                rutinas (
                    nombre,
                    descripcion
                )
            `)
            .eq('user_id', userId)
            .order('fecha', { ascending: false });

        if (errorEntrenamientos) {
            console.error('ERROR en consulta principal:', errorEntrenamientos);
            throw errorEntrenamientos;
        }

        console.log(`[INFO] Encontrados ${entrenamientos?.length || 0} entrenamientos`);

        const entrenamientosConSeries = await Promise.all(
            entrenamientos.map(async (entrenamiento) => {
                const { data: series, error: errorSeries } = await supabase
                    .from('series')
                    .select(`
                        id,
                        serie_number,
                        peso,
                        reps,
                        ejercicio_id,
                        ejercicios (
                            id,
                            nombre,
                            grupo_muscular
                        )
                    `)
                    .eq('entrenamiento_id', entrenamiento.id)
                    .order('ejercicio_id')
                    .order('serie_number');

                if (errorSeries) {
                    console.error(`ERROR al cargar series para entrenamiento ${entrenamiento.id}:`, errorSeries);
                    throw errorSeries;
                }

                return {
                    ...entrenamiento,
                    series: series || []
                };
            })
        );

        console.log('[ÉXITO] Entrenamientos cargados correctamente');
        res.status(200).json({
            success: true,
            entrenamientos: entrenamientosConSeries
        });

    } catch (error) {
        console.error('ERROR CRÍTICO al obtener entrenamientos:');
        console.error('Mensaje:', error.message);
        console.error('Detalles:', error.details || 'N/A');
        console.error('Hint:', error.hint || 'N/A');
        console.error('Código:', error.code || 'N/A');

        res.status(500).json({ 
            success: false,
            error: 'Error al obtener entrenamientos'
        });
    }
};

export default {
    guardarEntrenamiento,
    getAllEntrenamientos
};