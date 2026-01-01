const viewsController = {};

viewsController.renderHome = (req, res) => {
    res.render('completes/index', { title: 'Toji - Inicio' });
};

viewsController.renderRutinas = (req, res) => {
    res.render('completes/rutinas', { title: 'Toji - Mis Rutinas' });
};
                                      
viewsController.renderEjercicios = (req, res) => {
    res.render('completes/ejercicios', { title: 'Toji - Ejercicios' });
};
    
viewsController.renderPerfil = (req, res) => {
    res.render('completes/perfil', { title: 'Toji - Mi Perfil' });
};

viewsController.renderLogin = (req, res) => {
    res.render('completes/login', { title: 'Toji - Acceso' });
};

export default viewsController;