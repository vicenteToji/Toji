const API_URL = '/api/ejercicios';

document.addEventListener('DOMContentLoaded', () => {
    cargarEjercicios();
});

async function cargarEjercicios() {
    const contenedor = document.getElementById('lista-ejercicios');
    if (!contenedor) {
        console.error('No se encontró #lista-ejercicios en la página');
        return;
    }

    contenedor.innerHTML = '<p style="text-align:center; color:#666;">Cargando tus ejercicios...</p>';

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                contenedor.innerHTML = '<p style="color:orange;">Sesión expirada. <a href="/login">Inicia sesión de nuevo</a>.</p>';
                return;
            }
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const ejercicios = await response.json();

        contenedor.innerHTML = '';

        if (!ejercicios || ejercicios.length === 0) {
            contenedor.innerHTML = `
                <p style="text-align:center; color:#999;">
                    Aún no tienes ejercicios guardados.<br>
                    <a href="/ejercicios/nuevo" style="color:#1e90ff;">+ Añade tu primera técnica</a>
                </p>`;
            return;
        }

        ejercicios.forEach(ejercicio => {
            const card = document.createElement('div');
            card.className = 'card-ejercicio';
            card.innerHTML = `
                <h3>${ejercicio.nombre}</h3>
                <span class="tag">${ejercicio.grupo_muscular}</span>
                <p>${ejercicio.descripcion || 'Sin descripción'}</p>
                <small>Equipo: ${ejercicio.equipo || 'Ninguno'}</small>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error cargando ejercicios:', error);
        contenedor.innerHTML = '<p style="color:red; text-align:center;">Error al cargar ejercicios. Intenta recargar la página.</p>';
    }
}