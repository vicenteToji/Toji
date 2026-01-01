import ejercicioRepository from '../repositories/ejercicio.repository.mjs';

const ejercicioController = {};

ejercicioController.getAll = async (req, res) => {
    try {
        const ejercicios = await ejercicioRepository.findAll();
        
        res.status(200).json({
            status: 'success',
            data: ejercicios
        });
    } catch (error) {
        console.error('Error en ejercicioController.getAll:', error.message);
        
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener la lista de ejercicios de Toji'
        });
    }
};

ejercicioController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const ejercicio = await ejercicioRepository.findById(id);

        if (!ejercicio) {
            return res.status(404).json({
                status: 'error',
                message: 'Ejercicio no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            data: ejercicio
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al buscar el ejercicio'
        });
    }
};

export default ejercicioController;