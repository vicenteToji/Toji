const API_URL = 'http://localhost:4000/api/ejercicios';

document.addEventListener('DOMContentLoaded', () => {
    cargarEjercicios();
});

async function cargarEjercicios() {
    const contenedor = document.getElementById('lista-ejercicios');
    
    contenedor.innerHTML = '<p style="text-align:center">Cargando datos de Toji...</p>';

    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        contenedor.innerHTML = '';

        if (result.status === 'success') {
            const ejercicios = result.data;

            if (ejercicios.length === 0) {
                contenedor.innerHTML = '<p>No hay ejercicios registrados aún.</p>';
                return;
            }

            ejercicios.forEach(ejercicio => {
                const card = document.createElement('div');
                card.className = 'card-ejercicio'; 
                
                card.innerHTML = `
                    <h3>${ejercicio.nombre}</h3>
                    <span class="tag">${ejercicio.grupoMuscular}</span>
                    <p>${ejercicio.descripcion || 'Sin descripción'}</p>
                    <small>Equipo: ${ejercicio.equipo}</small>
                `;
                
                contenedor.appendChild(card);
            });
        } else {
            console.error('Error desde la API:', result.message);
            contenedor.innerHTML = '<p>Error al cargar los ejercicios.</p>';
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        contenedor.innerHTML = '<p>Error: No se pudo conectar con la API de Toji.</p>';
    }
}