// ==========================================================================
// Taleh - Módulo de Interfaz de Usuario (UI)
// ==========================================================================

// Esperamos a que todo el HTML de la página esté cargado
document.addEventListener('DOMContentLoaded', () => {
    inyectarEstructuraCarrito();
    vincularBotonesAgregar();
    renderizarCarrito();
});

/**
 * Inyecta el contenedor flotante del carrito y el botón flotante para abrirlo.
 * Respetará las clases estéticas de Taleh.
 */
function inyectarEstructuraCarrito() {
    // Si ya existe en el HTML por alguna razón, no lo volvemos a crear
    if (document.getElementById('carrito-lateral')) return;

    // 1. Creamos el Botón Flotante (El que tiene el ícono de la bolsa/carrito)
    const botonFlotante = document.createElement('div');
    botonFlotante.id = 'carrito-boton-flotante';
    botonFlotante.innerHTML = `
        <span class="icono-carrito">🛒</span>
        <span id="carrito-contador">0</span>
    `;
    document.body.appendChild(botonFlotante);

// 2. Creamos el Panel Lateral (Se oculta y se muestra de forma responsiva)
    const panelLateral = document.createElement('div');
    panelLateral.id = 'carrito-lateral';
    panelLateral.className = 'carrito-oculto'; // Empezará cerrado
    panelLateral.innerHTML = `
        <div class="carrito-header">
            <h2>Tu Pedido</h2>
            <button id="carrito-cerrar">×</button>
        </div>
        
        <div id="carrito-items-lista"></div>
        
        <div class="carrito-footer">
            <div class="carrito-total-linea">
                <span>Subtotal:</span>
                <span id="carrito-subtotal-valor">$0</span>
            </div>
            <!-- 💡 Limpiamos la clase vieja y el style inline para que herede el CSS limpio -->
            <button id="carrito-boton-checkout">
                Continuar Compra
            </button>
        </div>
    `;
    document.body.appendChild(panelLateral);

    // 3. EVENTOS: Hacemos que el botón flotante abra el carrito y el de la cruz lo cierre
    botonFlotante.addEventListener('click', () => panelLateral.classList.remove('carrito-oculto'));
    document.getElementById('carrito-cerrar').addEventListener('click', () => panelLateral.classList.add('carrito-oculto'));
}

/**
 * Recorre el carrito actual (del cerebro) y dibuja los elementos en el panel lateral.
 */
function renderizarCarrito() {
    const listaContenedor = document.getElementById('carrito-items-lista');
    const contadorBoton = document.getElementById('carrito-contador');
    const subtotalPantalla = document.getElementById('carrito-subtotal-valor');
    
    if (!listaContenedor) return;

    // Limpiamos el HTML viejo antes de redibujar
    listaContenedor.innerHTML = '';

    // Si el carrito está vacío, mostramos un mensaje poético adaptado a Taleh
    if (carrito.length === 0) {
        listaContenedor.innerHTML = '<p class="carrito-vacio-msg">El carrito está esperando tus lecturas.</p>';
        contadorBoton.innerText = '0';
        subtotalPantalla.innerText = '$0';
        return;
    }

    // Si tiene productos, los recorremos uno por uno
    let totalItems = 0;
    
    carrito.forEach(producto => {
        totalItems += producto.cantidad;
        
        const itemElemento = document.createElement('div');
        itemElemento.className = 'carrito-item-row';
        itemElemento.innerHTML = `
            <div class="item-info">
                <h4>${producto.titulo}</h4>
                <p>$${producto.precio} c/u</p>
            </div>
            <div class="item-controles">
                <button onclick="cambiarCantidadDesdeUI('${producto.id}', ${producto.cantidad - 1})">-</button>
                <span>${producto.cantidad}</span>
                <button onclick="cambiarCantidadDesdeUI('${producto.id}', ${producto.cantidad + 1})">+</button>
                <button class="btn-eliminar" onclick="eliminarDesdeUI('${producto.id}')">🗑️</button>
            </div>
        `;
        listaContenedor.appendChild(itemElemento);
    });

    // Actualizamos los números finales en la interfaz
    contadorBoton.innerText = totalItems;
    subtotalPantalla.innerText = `$${obtenerSubtotalCarrito()}`;
}

/**
 * Puentes intermedios que conectan los clics de la interfaz con las funciones del cerebro (carrito.js)
 */
function cambiarCantidadDesdeUI(id, nuevaCantidad) {
    actualizarCantidadProducto(id, nuevaCantidad); // Llama a carrito.js
    renderizarCarrito(); // Redibuja los cambios en la pantalla
}

function eliminarDesdeUI(id) {
    eliminarProductoDelCarrito(id); // Llama a carrito.js
    renderizarCarrito(); // Redibuja los cambios en la pantalla
}

/**
 * Busca los botones de compra que ya tenés en tus tarjetas de la biblioteca y los enlaza a JS.
 */
function vincularBotonesAgregar() {
    const botones = document.querySelectorAll('.boton-comprar');
    
    botones.forEach(boton => {
        // 🔍 Buscamos si esta tarjeta específica tiene un selector de variantes
        let contenedorCard = boton.parentElement;
        let selectorVariante = contenedorCard.querySelector('.selector-variante');
        
        if (!selectorVariante && contenedorCard.parentElement) {
            selectorVariante = contenedorCard.parentElement.querySelector('.selector-variante');
        }

        // 📸 Si existe el selector (como en la Selah), programamos el cambio de foto
        if (selectorVariante) {
            selectorVariante.addEventListener('change', (evento) => {
                const varianteElegida = evento.target.value.toLowerCase(); // Ejemplo: "azul" o "rosa"
                
                // Buscamos la imagen de la agenda dentro de la misma tarjeta
                // (Asumiendo que tus tarjetas tienen una etiqueta <img> arriba)
                let tarjetaCompleta = selectorVariante.closest('.tarjeta-producto') || contenedorCard.parentElement;
                let imagenAgenda = tarjetaCompleta.querySelector('img');
                
                if (imagenAgenda) {
                    // ⚠️ IMPORTANTE: Ajustá los nombres de tus archivos según cómo se llamen tus fotos reales
                    if (varianteElegida.includes('azul')) {
                        imagenAgenda.src = 'imagenes/seccion-biblioteca/productos/agenda-selah/1.jpeg'; 
                    } else if (varianteElegida.includes('violeta')) {
                        imagenAgenda.src = 'imagenes/seccion-biblioteca/productos/agenda-selah/portada.jpeg'; // O el color/nombre base que tengas
                    }
                }
            });
        }
        
        // 🛒 Evento del clic para agregar al carrito (se mantiene igual a como lo tenías)
        boton.addEventListener('click', (evento) => {
            evento.preventDefault();
            
            const idBase = boton.getAttribute('data-id');
            let titulo = boton.getAttribute('data-titulo');
            const precio = parseInt(boton.getAttribute('data-precio')) || 0;
            
            if (!idBase || !titulo) {
                console.error("Faltan atributos data-id o data-titulo en este botón.");
                return;
            }
            
            let idFinal = idBase;
            
            if (selectorVariante) {
                const varianteElegida = selectorVariante.value;
                titulo = `${titulo} (${varianteElegida})`;
                idFinal = `${idBase}-${varianteElegida.toLowerCase().replace(/\s+/g, '-')}`;
            }
            
            agregarProductoAlCarrito(idFinal, titulo, precio);
            renderizarCarrito();
            document.getElementById('carrito-lateral').classList.remove('carrito-oculto');
        });
    });
}