import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR CRÍTICO: Faltan las credenciales de Supabase en el archivo .env');
    process.exit(1); 
}

export const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_KEY
);