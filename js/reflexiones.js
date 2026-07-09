/**
 * Abre el modal de reflexión con un efecto de animación.
 * @param {string} titulo - El título de la reflexión.
 * @param {string} texto - El contenido completo de la reflexión.
 */
function abrirReflexion(titulo, texto) {
    const modal = document.getElementById('modal-reflexion');
    const contenido = document.getElementById('contenido-reflexion');
    
    contenido.style.opacity = "0";
contenido.innerHTML = `
        <h2 style="font-family: 'Cinzel Decorative', cursive; color: #5d4037;">${titulo}</h2>
        <p style="font-family: 'Almendra', serif; line-height: 1.6; color: #3e2723;">${texto}</p>
    `;
    
    modal.style.display = "flex";
    
    setTimeout(() => {
        modal.classList.add('activo');
        
        // Esperamos 1000ms (1 segundo) para que el texto aparezca 
        // cuando el pergamino ya esté bastante abierto
        setTimeout(() => {
            contenido.style.transition = "opacity 0.8s ease";
            contenido.style.opacity = "1";
        }, 1000); 
    }, 10);
}

function mostrarReflexionTema() {
    abrirReflexion('Tema del mes', `
        <p>Paz en la Tormenta...</p>
        <div style="text-align: center;">
            <img src="imagenes/seccion-reflexiones/tema-del-mes/tamuz.png" style="width:40%; border-radius:8px; margin: 40px auto; display:block;">
        </div>
        <p>Y aquí continúa la enseñanza...</p>
    `);
}


function mostrarReflexionTamuz() {
    abrirReflexion('Mes Bíblico de Tamuz', `
        <p>Enseñanza de Tamuz...</p>
        <div style="text-align: center;">
            <img src="imagenes/seccion-reflexiones/tema-del-mes/ilustracion-tamuz.png" style="width:60%; border-radius:8px; margin: 40px auto; display:block;">
        </div>
        <p>Y aquí continúa la enseñanza...</p>
    `);
}

function cerrarModal() {
    const modal = document.getElementById('modal-reflexion');
    const contenido = document.getElementById('contenido-reflexion');
    
    contenido.style.opacity = "0";
    modal.classList.remove('activo');
    
    // Esperamos 1500ms (1.5 segundos) para que termine de cerrarse
    setTimeout(() => {
        modal.style.display = "none";
    }, 1500); 
}



// Opcional: Cerrar el modal si hacen clic fuera del pergamino (en el fondo oscuro)
window.onclick = function(event) {
    const modal = document.getElementById('modal-reflexion');
    if (event.target == modal) {
        cerrarModal();
    }
}