import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const getAllEjercicios = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('ejercicios')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener ejercicios:', error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Supabase' });
    }
};

const createEjercicio = async (req, res) => {
    const { nombre, grupo_muscular, descripcion } = req.body;

    if (!nombre || !grupo_muscular) {
        return res.status(400).json({ error: 'Nombre y Grupo Muscular son obligatorios' });
    }

    try {
        const { data, error } = await supabase
            .from('ejercicios')
            .insert([
                { 
                    nombre, 
                    grupo_muscular, 
                    descripcion 
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'Ejercicio creado con éxito',
            data: data[0]
        });
    } catch (error) {
        console.error('Error al insertar ejercicio:', error.message);
        res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }
};

export default {
    getAllEjercicios,
    createEjercicio
};