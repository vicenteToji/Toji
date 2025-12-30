// controllers/views.controller.mjs

const viewsController = {};

// Renderiza el Dashboard principal
viewsController.renderHome = (req, res) => {
    res.render('completes/index', { title: 'Toji - Inicio' });
};

// Renderiza la lista de rutinas
viewsController.renderRutinas = (req, res) => {
    res.render('completes/rutinas', { title: 'Toji - Mis Rutinas' });
};

// Renderiza la biblioteca de ejercicios
viewsController.renderEjercicios = (req, res) => {
    res.render('completes/ejercicios', { title: 'Toji - Ejercicios' });
};

// Renderiza el perfil del usuario
viewsController.renderPerfil = (req, res) => {
    res.render('completes/perfil', { title: 'Toji - Mi Perfil' });
};

// Renderiza la página de login (la que da el error)
viewsController.renderLogin = (req, res) => {
    res.render('completes/login', { title: 'Toji - Acceso' });
};

export default viewsController;