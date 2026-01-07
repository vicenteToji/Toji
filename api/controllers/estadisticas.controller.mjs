import { supabase } from '../config/supabase.mjs';

const getSeriesPorSemana = async (req, res) => {
    const userId = req.user?.uid;

    if (!userId) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);

        const { data: entrenamientos, error: errorEntrenamientos } = await supabase
            .from('entrenamientos')
            .select('id, fecha')
            .eq('user_id', userId)
            .gte('fecha', hace30Dias.toISOString())
            .order('fecha', { ascending: true });

        if (errorEntrenamientos) {
            console.error('Error consultando entrenamientos:', errorEntrenamientos);
            throw errorEntrenamientos;
        }

        if (!entrenamientos || entrenamientos.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const entrenamientoIds = entrenamientos.map(e => e.id);

        const { data: series, error: errorSeries } = await supabase
            .from('series')
            .select('entrenamiento_id')
            .in('entrenamiento_id', entrenamientoIds);

        if (errorSeries) {
            console.error('Error consultando series:', errorSeries);
            throw errorSeries;
        }

        const seriesPorEntrenamiento = {};
        if (series) {
            series.forEach(serie => {
                const id = serie.entrenamiento_id;
                seriesPorEntrenamiento[id] = (seriesPorEntrenamiento[id] || 0) + 1;
            });
        }

        const counts = {};

        entrenamientos.forEach(entrenamiento => {
            const fecha = new Date(entrenamiento.fecha);
            const diaKey = fecha.toISOString().split('T')[0];

            if (!counts[diaKey]) {
                counts[diaKey] = 0;
            }

            const cantidadSeries = seriesPorEntrenamiento[entrenamiento.id] || 0;
            counts[diaKey] += cantidadSeries;
        });

        const sortedKeys = Object.keys(counts).sort();

        const data = sortedKeys.map(key => ({
            dia: key,
            count: counts[key]
        }));

        res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('Error en estadísticas:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al cargar estadísticas',
            detalles: error.message 
        });
    }
};

export default { getSeriesPorSemana };