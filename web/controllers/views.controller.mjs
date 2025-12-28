const viewsController = {};

viewsController.renderHome = (req, res) => {
    res.render('completes/index', { title: 'Inicio - Antigravity' });
};

viewsController.renderRutinas = (req, res) => {
    res.render('completes/rutinas', { title: 'Mis Rutinas' });
};

viewsController.renderEjercicios = (req, res) => {
    res.render('completes/ejercicios', { title: 'Ejercicios' });
};

viewsController.renderLogin = (req, res) => {
    res.render('completes/login', { title: 'Iniciar Sesión' });
};

export default viewsController;