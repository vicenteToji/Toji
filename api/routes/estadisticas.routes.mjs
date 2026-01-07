import { Router } from 'express';
import estadisticasController from '../controllers/estadisticas.controller.mjs';
import { authenticateApi } from '../middlewares/auth.api.mjs';

const router = Router();

router.get('/series-por-semana', authenticateApi, estadisticasController.getSeriesPorSemana);

export default router;