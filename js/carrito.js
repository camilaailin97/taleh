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
    
    let grupos = { 'cruce-rosa': 0, 'espada': 0, 'set-hebreo': 0, 'set-urbano': 0, 'set-foil-varios': 0 };
    let precioBase = { 'cruce-rosa': 0, 'espada': 0, 'set-hebreo': 0, 'set-urbano': 0, 'set-foil-varios': 0 };

    carrito.forEach(p => {
        // Aseguramos que el precio sea siempre un número
        let precio = Number(p.precio) || 0;
        
        if (grupos.hasOwnProperty(p.categoria)) {
            grupos[p.categoria] += p.cantidad;
            precioBase[p.categoria] = precio;
        } else {
            subtotalTotal += precio * p.cantidad;
        }
    });

    // Cálculos protegidos: usamos (precioBase[...] || 0) para evitar undefined
    subtotalTotal += (Math.floor(grupos['cruce-rosa'] / 2) * (precioBase['cruce-rosa'] * 1.5)) + ((grupos['cruce-rosa'] % 2) * precioBase['cruce-rosa']);
    subtotalTotal += (Math.floor(grupos['espada'] / 2) * (precioBase['espada'] * 1.8)) + ((grupos['espada'] % 2) * precioBase['espada']);
    subtotalTotal += (Math.floor(grupos['set-hebreo'] / 4) * (precioBase['set-hebreo'] * 2.6)) + ((grupos['set-hebreo'] % 4) * precioBase['set-hebreo']);
    subtotalTotal += (Math.floor(grupos['set-urbano'] / 3) * (precioBase['set-urbano'] * 2.1)) + ((grupos['set-urbano'] % 3) * precioBase['set-urbano']);
    subtotalTotal += (Math.floor(grupos['set-foil-varios'] / 3) * (precioBase['set-foil-varios'] * 2)) + ((grupos['set-foil-varios'] % 3) * precioBase['set-foil-varios']);

    return Math.round(subtotalTotal);
}
function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnStorage();
    console.log("🧹 Carrito completamente vaciado.");
}