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

    // 🚀 REDIRECCIÓN AL CHECKOUT (PASO 3)
    document.getElementById('carrito-boton-checkout').addEventListener('click', () => {
        // Redirige directamente a la nueva página que creaste
        window.location.href = 'checkout.html';
    });
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
        let contenedorCard = boton.closest('.categoria-caja') || boton.parentElement;
        let selectorVariante = contenedorCard.querySelector('.selector-variante');
        
        if (!selectorVariante && contenedorCard.parentElement) {
            selectorVariante = contenedorCard.parentElement.querySelector('.selector-variante');
        }

        // 📸 1. CAMBIO DE FOTO EN VIVO (Para todos los productos)
        if (selectorVariante) {
            selectorVariante.addEventListener('change', (evento) => {
                const varianteElegida = evento.target.value.toLowerCase();
                let tarjetaCompleta = selectorVariante.closest('.categoria-caja') || selectorVariante.closest('.tarjeta-producto') || contenedorCard.parentElement;
                
                const botonDeEstaTarjeta = tarjetaCompleta.querySelector('.boton-comprar');
                const idProducto = botonDeEstaTarjeta ? botonDeEstaTarjeta.getAttribute('data-id') : '';
                let imagenProducto = tarjetaCompleta.querySelector('img');

                if (!imagenProducto) return;

                // 📔 CASO A: Agenda Selah
                if (idProducto === 'agenda-selah') {
                    if (varianteElegida.includes('azul')) {
                        imagenProducto.src = 'imagenes/seccion-biblioteca/productos/agenda-selah/1.jpeg'; 
                    } else if (varianteElegida.includes('violeta')) {
                        imagenProducto.src = 'imagenes/seccion-biblioteca/productos/agenda-selah/portada.jpeg'; 
                    }
                }
                
                // 📜 CASO B: Láminas Palabras en Hebreo
                else if (idProducto === 'lamina-hebreo') {
                    const rutaHebreo = 'imagenes/seccion-biblioteca/productos/laminas/hebreo-foil/';
                    if (varianteElegida.includes('shalom')) {
                        imagenProducto.src = rutaHebreo + 'shalom.jpeg';
                    } else if (varianteElegida.includes('jesed')) {
                        imagenProducto.src = rutaHebreo + 'jesed.jpeg';
                    } else if (varianteElegida.includes('ahava')) {
                        imagenProducto.src = rutaHebreo + 'ahava.jpeg';
                    } else if (varianteElegida.includes('emuna')) {
                        imagenProducto.src = rutaHebreo + 'emuna.jpeg';
                    }
                }

                // 🏙️ CASO C: Láminas Metalizadas Plateadas (Arte Cristiano Urbano)
                else if (idProducto === 'lamina-urbana') {
                    const rutaUrbana = 'imagenes/seccion-biblioteca/productos/laminas/metalizados/';
                    if (varianteElegida.includes('ojo')) {
                        imagenProducto.src = rutaUrbana + 'ojo.jpeg';
                    } else if (varianteElegida.includes('yeshua')) {
                        imagenProducto.src = rutaUrbana + 'yeshua.jpeg';
                    } else if (varianteElegida.includes('rey')) {
                        imagenProducto.src = rutaUrbana + 'rey.jpeg';
                    }
                }
                
                // 🎨 CASO D: Láminas Diseños Metalizados Varios
                else if (idProducto === 'lamina-foil-varios') {
                    const rutaFoil = 'imagenes/seccion-biblioteca/productos/laminas/foil/';
                    
                    if (varianteElegida.includes('cruz corazón')) {
                        imagenProducto.src = rutaFoil + 'cruz-corazon.jpeg';
                    } else if (varianteElegida.includes('cuadro azul')) {
                        imagenProducto.src = rutaFoil + 'cuadro-azul.jpeg';
                    } else if (varianteElegida.includes('cuadro negro')) {
                        imagenProducto.src = rutaFoil + 'cuadro-negro.jpeg';
                    } else if (varianteElegida.includes('cuadro plateado')) {
                        imagenProducto.src = rutaFoil + 'cuadro-plateado.jpeg';
                    } else if (varianteElegida.includes('lámpara')) {
                        imagenProducto.src = rutaFoil + 'lampara.jpeg';
                    } else if (varianteElegida.includes('ojo foil') || varianteElegida.includes('llama de fuego')) {
                        imagenProducto.src = rutaFoil + 'ojo-foil.jpeg';
                    } else if (varianteElegida.includes('proverbios') && varianteElegida.includes('manchas')) {
                        imagenProducto.src = rutaFoil + 'proverbios-manchas.jpeg';
                    } else if (varianteElegida.includes('proverbios')) {
                        imagenProducto.src = rutaFoil + 'proverbios.jpeg';
                    } else if (varianteElegida.includes('rey de reyes') && varianteElegida.includes('dorado')) {
                        imagenProducto.src = rutaFoil + 'rey-de-reyes-dorado.jpeg';
                    } else if (varianteElegida.includes('rey de reyes') && varianteElegida.includes('plateado')) {
                        imagenProducto.src = rutaFoil + 'rey-de-reyes-plateado.jpeg';
                    } else if (varianteElegida.includes('rey de reyes') && varianteElegida.includes('rojo')) {
                        imagenProducto.src = rutaFoil + 'rey-de-reyes-rojo.jpeg';
                    } else if (varianteElegida.includes('yeshua') && varianteElegida.includes('azul')) {
                        imagenProducto.src = rutaFoil + 'yeshua-es-rey-azul.jpeg';
                    } else if (varianteElegida.includes('yeshua') && varianteElegida.includes('dorado')) {
                        imagenProducto.src = rutaFoil + 'yeshua-es-rey-dorado.jpeg';
                    }
                }
            });
        }
        
        // 🛒 2. EVENTO CLIC PARA AGREGAR AL CARRITO
        boton.addEventListener('click', (evento) => {
            evento.preventDefault();
            
            const idBase = boton.getAttribute('data-id');
            let titulo = boton.getAttribute('data-titulo');
            const precio = parseInt(boton.getAttribute('data-precio')) || 0;
            let imagenUrl = boton.getAttribute('data-imagen') || 'imagenes/default.jpg';
            const categoria = boton.getAttribute('data-categoria') || 'general';
            
            if (!idBase || !titulo) {
                console.error("Faltan atributos en este botón.");
                return;
            }
            
            let idFinal = idBase;
            
            if (selectorVariante) {
                const varianteElegida = selectorVariante.value;
                titulo = `${titulo} (${varianteElegida})`;
                idFinal = `${idBase}-${varianteElegida.toLowerCase().replace(/\s+/g, '-')}`;
                
                const varianteMinuscula = varianteElegida.toLowerCase();
                
                if (idBase === 'agenda-selah') {
                    if (varianteMinuscula.includes('azul')) {
                        imagenUrl = 'imagenes/seccion-biblioteca/productos/agenda-selah/1.jpeg'; 
                    } else if (varianteMinuscula.includes('violeta')) {
                        imagenUrl = 'imagenes/seccion-biblioteca/productos/agenda-selah/portada.jpeg'; 
                    }
                } else if (idBase === 'lamina-hebreo') {
                    if (varianteMinuscula.includes('shalom')) imagenUrl = 'imagenes/seccion-biblioteca/productos/laminas/hebreo-foil/shalom.jpeg';
                    else if (varianteMinuscula.includes('jesed')) imagenUrl = 'imagenes/seccion-biblioteca/productos/laminas/hebreo-foil/jesed.jpeg';
                    else if (varianteMinuscula.includes('ahava')) imagenUrl = 'imagenes/seccion-biblioteca/productos/laminas/hebreo-foil/ahava.jpeg';
                    else if (varianteMinuscula.includes('emuna')) imagenUrl = 'imagenes/seccion-biblioteca/productos/laminas/hebreo-foil/emuna.jpeg';
                } else if (idBase === 'lamina-urbana') {
                    if (varianteMinuscula.includes('ojo')) imagenUrl = 'imagenes/seccion-biblioteca/productos/laminas/metalizados/ojo.jpeg';
                    else if (varianteMinuscula.includes('yeshua')) imagenUrl = 'imagenes/seccion-biblioteca/productos/laminas/metalizados/yeshua.jpeg';
                    else if (varianteMinuscula.includes('rey')) imagenUrl = 'imagenes/seccion-biblioteca/productos/laminas/metalizados/rey.jpeg';
                } else if (idBase === 'lamina-foil-varios') {
                    const rutaFoil = 'imagenes/seccion-biblioteca/productos/laminas/foil/';
                    
                    if (varianteMinuscula.includes('cruz corazón')) {
                        imagenUrl = rutaFoil + 'cruz-corazon.jpeg';
                    } else if (varianteMinuscula.includes('cuadro azul')) {
                        imagenUrl = rutaFoil + 'cuadro-azul.jpeg';
                    } else if (varianteMinuscula.includes('cuadro negro')) {
                        imagenUrl = rutaFoil + 'cuadro-negro.jpeg';
                    } else if (varianteMinuscula.includes('cuadro plateado')) {
                        imagenUrl = rutaFoil + 'cuadro-plateado.jpeg';
                    } else if (varianteMinuscula.includes('lámpara')) {
                        imagenUrl = rutaFoil + 'lampara.jpeg';
                    } else if (varianteMinuscula.includes('ojo foil') || varianteMinuscula.includes('llama de fuego')) {
                        imagenUrl = rutaFoil + 'ojo-foil.jpeg';
                    } else if (varianteMinuscula.includes('proverbios') && varianteMinuscula.includes('manchas')) {
                        imagenUrl = rutaFoil + 'proverbios-manchas.jpeg';
                    } else if (varianteMinuscula.includes('proverbios')) {
                        imagenUrl = rutaFoil + 'proverbios.jpeg';
                    } else if (varianteMinuscula.includes('rey de reyes') && varianteMinuscula.includes('dorado')) {
                        imagenUrl = rutaFoil + 'rey-de-reyes-dorado.jpeg';
                    } else if (varianteMinuscula.includes('rey de reyes') && varianteMinuscula.includes('plateado')) {
                        imagenUrl = rutaFoil + 'rey-de-reyes-plateado.jpeg';
                    } else if (varianteMinuscula.includes('rey de reyes') && varianteMinuscula.includes('rojo')) {
                        imagenUrl = rutaFoil + 'rey-de-reyes-rojo.jpeg';
                    } else if (varianteMinuscula.includes('yeshua') && varianteMinuscula.includes('azul')) {
                        imagenUrl = rutaFoil + 'yeshua-es-rey-azul.jpeg';
                    } else if (varianteMinuscula.includes('yeshua') && varianteMinuscula.includes('dorado')) {
                        imagenUrl = rutaFoil + 'yeshua-es-rey-dorado.jpeg';
                    }
                }
            }
            
            agregarProductoAlCarrito(idFinal, titulo, precio, imagenUrl, categoria);
            renderizarCarrito();
            document.getElementById('carrito-lateral').classList.remove('carrito-oculto');
        });
    });
}

function renderizarCarrito() {
    const listaContenedor = document.getElementById('carrito-items-lista');
    const contadorBoton = document.getElementById('carrito-contador');
    const subtotalPantalla = document.getElementById('carrito-subtotal-valor');
    
    if (!listaContenedor) return;

    listaContenedor.innerHTML = '';

    if (carrito.length === 0) {
        listaContenedor.innerHTML = '<p class="carrito-vacio-msg">El carrito está esperando tus lecturas.</p>';
        contadorBoton.innerText = '0';
        subtotalPantalla.innerText = '$0';
        return;
    }

    let totalItems = 0;
    
    carrito.forEach(producto => {
        totalItems += producto.cantidad;
        
        // Buscamos la imagen guardada en el producto (o usamos una de respaldo)
        const fotoProducto = producto.imagen || 'img/default.jpg';
        
        const itemElemento = document.createElement('div');
        itemElemento.className = 'carrito-item-row';
        itemElemento.innerHTML = `
            <div class="item-foto-contenedor">
                <img src="${fotoProducto}" alt="${producto.titulo}" class="carrito-item-mini">
            </div>
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

    contadorBoton.innerText = totalItems;
    subtotalPantalla.innerText = `$${obtenerSubtotalCarrito()}`;
}