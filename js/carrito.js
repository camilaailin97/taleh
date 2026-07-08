// ==========================================================================
// Taleh - Módulo del Carrito (Cerebro de Datos)
// ==========================================================================

// 1. ESTADO GLOBAL: Intentamos cargar el carrito guardado previamente en LocalStorage.
let carrito = JSON.parse(localStorage.getItem('taleh_carrito')) || [];

/**
 * Guarda el estado actual del array 'carrito' en la memoria LocalStorage.
 */
function guardarCarritoEnStorage() {
    localStorage.setItem('taleh_carrito', JSON.stringify(carrito));
}

// 1. Modificamos para recibir y guardar la categoría del producto
function agregarProductoAlCarrito(id, titulo, precio, imagenUrl, categoria) {
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        const nuevoProducto = {
            id: id,
            titulo: titulo,
            precio: precio,
            cantidad: 1,
            imagen: imagenUrl,
            categoria: categoria || 'general' 
        };
        carrito.push(nuevoProducto);
    }

    guardarCarritoEnStorage();
    console.log(`🛒 Agregado: ${titulo} (Cat: ${categoria}).`, carrito);
}

/**
 * Modifica la cantidad de un ítem directamente.
 */
function actualizarCantidadProducto(id, nuevaCantidad) {
    const indice = carrito.findIndex(item => item.id === id);

    if (indice !== -1) {
        if (nuevaCantidad <= 0) {
            carrito.splice(indice, 1);
        } else {
            carrito[indice].cantidad = nuevaCantidad;
        }
        
        guardarCarritoEnStorage();
        console.log(`🔄 Cantidad actualizada para ID ${id}. Carrito actual:`, carrito);
    }
}

/**
 * Elimina por completo un producto del carrito.
 */
function eliminarProductoDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarritoEnStorage();
    console.log(`🗑️ Producto con ID ${id} eliminado. Carrito actual:`, carrito);
}

/**
 * Calcula la suma de los precios multiplicados por sus cantidades con descuentos.
 */
function obtenerSubtotalCarrito() {
    let subtotalTotal = 0;
    
    let contadorCrucesRosas = 0;
    let contadorEspadas = 0;
    
    let contadorHebreo = 0;
    let contadorUrbano = 0;
    let contadorFoilVarios = 0;

    carrito.forEach(producto => {
        if (producto.categoria === 'cruce-rosa') {
            contadorCrucesRosas += producto.cantidad;
        } else if (producto.categoria === 'espada') {
            contadorEspadas += producto.cantidad;
        } else if (producto.categoria === 'set-hebreo') {
            contadorHebreo += producto.cantidad;
        } else if (producto.categoria === 'set-urbano') {
            contadorUrbano += producto.cantidad;
        } else if (producto.categoria === 'set-foil-varios') {
            contadorFoilVarios += producto.cantidad;
        } else {
            subtotalTotal += producto.precio * producto.cantidad;
        }
    });

    // 🌟 PROMO SEÑALADORES: Cruces y Rosas (2 x $1500)
    const paresCrucesRosas = Math.floor(contadorCrucesRosas / 2);
    const sueltasCrucesRosas = contadorCrucesRosas % 2;
    subtotalTotal += (paresCrucesRosas * 1500) + (sueltasCrucesRosas * 900);

    // 🌟 PROMO SEÑALADORES: Espadas (2 x $1800)
    const paresEspadas = Math.floor(contadorEspadas / 2);
    const sueltasEspadas = contadorEspadas % 2;
    subtotalTotal += (paresEspadas * 1800) + (sueltasEspadas * 1000);

    // 🌟 NUEVOS PRECIOS LÁMINAS
    // Hebreo: Set 4 x $4000, sueltas $1500
    const setsHebreo = Math.floor(contadorHebreo / 4);
    const sueltasHebreo = contadorHebreo % 4;
    subtotalTotal += (setsHebreo * 4000) + (sueltasHebreo * 1500);

    // Urbano: Set 3 x $4000, sueltas $1900
    const setsUrbano = Math.floor(contadorUrbano / 3);
    const sueltasUrbano = contadorUrbano % 3;
    subtotalTotal += (setsUrbano * 4000) + (sueltasUrbano * 1900);

    // Foil Varios: Set 3 x $3500, sueltas $1700
    const setsFoilVarios = Math.floor(contadorFoilVarios / 3);
    const sueltasFoilVarios = contadorFoilVarios % 3;
    subtotalTotal += (setsFoilVarios * 3500) + (sueltasFoilVarios * 1700);

    return subtotalTotal;
}

function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnStorage();
    console.log("🧹 Carrito completamente vaciado.");
}