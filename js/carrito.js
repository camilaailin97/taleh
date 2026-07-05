// ==========================================================================
// Taleh - Módulo del Carrito (Cerebro de Datos)
// ==========================================================================

// 1. ESTADO GLOBAL: Intentamos cargar el carrito guardado previamente en LocalStorage.
//    Si no hay nada guardado, iniciamos con un array (lista) vacío [].
let carrito = JSON.parse(localStorage.getItem('taleh_carrito')) || [];

/**
 * Guarda el estado actual del array 'carrito' en la memoria LocalStorage.
 * Se debe llamar a esta función cada vez que agreguemos, quitemos o modifiquemos algo.
 */
function guardarCarritoEnStorage() {
    // Convertimos el array de objetos a una cadena de texto (JSON) para que LocalStorage lo entienda
    localStorage.setItem('taleh_carrito', JSON.stringify(carrito));
}

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existía.
 * @param {string} id - Identificador único del producto (ej: 'senalador-flora')
 * @param {string} titulo - Nombre visible del producto
 * @param {number} precio - Precio unitario del producto
 */
function agregarProductoAlCarrito(id, titulo, precio) {
    // Buscamos si el producto ya está en el carrito usando su ID
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        // Si ya existe, simplemente le sumamos 1 a su cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si es un producto nuevo, lo creamos con cantidad 1 y lo empujamos (push) al array
        const nuevoProducto = {
            id: id,
            titulo: titulo,
            precio: precio,
            cantidad: 1
        };
        carrito.push(nuevoProducto);
    }

    // Guardamos los cambios en la memoria del navegador
    guardarCarritoEnStorage();
    console.log(`🛒 Producto agregado: ${titulo}. Carrito actual:`, carrito);
}

/**
 * Modifica la cantidad de un ítem directamente (útil para los botones + y - de la UI).
 * @param {string} id - ID del producto a modificar
 * @param {number} nuevaCantidad - El número nuevo de unidades
 */
function actualizarCantidadProducto(id, nuevaCantidad) {
    // Buscamos el índice (la posición) del producto en nuestra lista
    const indice = carrito.findIndex(item => item.id === id);

    if (indice !== -1) {
        if (nuevaCantidad <= 0) {
            // Si la cantidad es 0 o menos, significa que hay que eliminarlo de la lista
            carrito.splice(indice, 1);
        } else {
            // Si es un número válido, actualizamos el valor
            carrito[indice].cantidad = nuevaCantidad;
        }
        
        guardarCarritoEnStorage();
        console.log(`🔄 Cantidad actualizada para ID ${id}. Carrito actual:`, carrito);
    }
}

/**
 * Elimina por completo un producto del carrito sin importar cuántas unidades tenía.
 * @param {string} id - ID del producto a remover
 */
function eliminarProductoDelCarrito(id) {
    // Filtramos el array para dejar afuera únicamente al producto que coincida con el ID
    carrito = carrito.filter(item => item.id !== id);
    
    guardarCarritoEnStorage();
    console.log(`🗑️ Producto con ID ${id} eliminado. Carrito actual:`, carrito);
}

/**
 * Calcula la suma de los precios multiplicados por sus cantidades correspondientes.
 * @returns {number} El subtotal acumulado de la compra
 */
function obtenerSubtotalCarrito() {
    // El método 'reduce' recorre el array y va acumulando el total matemático
    return carrito.reduce((acumulado, item) => acumulado + (item.precio * item.cantidad), 0);
}

/**
 * Vacía por completo el carrito de compras (útil para cuando finalice el pedido).
 */
function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnStorage();
    console.log("🧹 Carrito completamente vaciado.");
}