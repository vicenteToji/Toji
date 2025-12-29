const viewsController = {};

viewsController.renderHome = (req, res) => {
    res.render('completes/index');
};

viewsController.renderRutinas = (req, res) => {
    res.render('completes/rutinas'); 
};

viewsController.renderEjercicios = (req, res) => {
    res.render('completes/ejercicios');
};

viewsController.renderPerfil = (req, res) => {
    res.render('completes/perfil');
};

viewsController.renderLogin = (req, res) => {
    res.render('completes/login');
};

export default viewsController;