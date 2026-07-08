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
/**
 * Calcula la suma total aplicando las promociones exactas.
 */
function obtenerSubtotalCarrito() {
    let subtotalFinal = 0;
    
    let grupos = { 
        'cruce-rosa': 0, 
        'espada': 0, 
        'set-hebreo': 0, 
        'set-urbano': 0, 
        'set-foil-varios': 0 
    };

    carrito.forEach(p => {
        let precio = Number(p.precio) || 0;
        
        if (grupos.hasOwnProperty(p.categoria)) {
            grupos[p.categoria] += p.cantidad;
        } else {
            subtotalFinal += precio * p.cantidad;
        }
    });

    // PROMOS (Precios fijos reales)
 
    // 1. Cruces y Rosas (cruce-rosa): 2 x $1.500 ($900 c/u)
subtotalFinal += (Math.floor(grupos['cruce-rosa'] / 2) * 1500) + ((grupos['cruce-rosa'] % 2) * 900);
    
    // 2. Espadas: 2 x $1.800 ($1.000 c/u)
    subtotalFinal += (Math.floor(grupos['espada'] / 2) * 1800) + ((grupos['espada'] % 2) * 1000);
    
    // 3. Set Hebreo: 4 x $4.000 ($1.500 c/u)
    subtotalFinal += (Math.floor(grupos['set-hebreo'] / 4) * 4000) + ((grupos['set-hebreo'] % 4) * 1500);
    
    // 4. Set Urbano: 3 x $4.000 ($1.900 c/u)
    subtotalFinal += (Math.floor(grupos['set-urbano'] / 3) * 4000) + ((grupos['set-urbano'] % 3) * 1900);
    
    // 5. Set Foil Varios: 3 x $3.500 ($1.700 c/u)
    subtotalFinal += (Math.floor(grupos['set-foil-varios'] / 3) * 3500) + ((grupos['set-foil-varios'] % 3) * 1700);

    return Math.round(subtotalFinal);
}
function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnStorage();
    console.log("🧹 Carrito completamente vaciado.");
}