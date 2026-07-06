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
            categoria: categoria || 'general' // 💡 Guardamos la categoría del producto
        };
        carrito.push(nuevoProducto);
    }

    guardarCarritoEnStorage();
    console.log(`🛒 Agregado: ${titulo} (Cat: ${categoria}).`, carrito);
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
// 2. Modificamos el cálculo del Subtotal para que aplique los descuentos automáticamente
function obtenerSubtotalCarrito() {
    let subtotalTotal = 0;
    
    // Contadores para Señaladores
    let contadorCrucesRosas = 0;
    let contadorEspadas = 0;
    
    // Contadores para las nuevas promos de Láminas
    let contadorHebreo = 0;
    let contadorUrbano = 0;
    let contadorFoilVarios = 0;

    // Clasificamos y contamos cantidades por categoría
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
            // Agendas y otros productos calculan directo sin promo
            subtotalTotal += producto.precio * producto.cantidad;
        }
    });

    // 🌟 PROMO SEÑALADORES: Cruces y Rosas (2 x $1500, sueltos $900)
    const paresCrucesRosas = Math.floor(contadorCrucesRosas / 2);
    const sueltosCrucesRosas = contadorCrucesRosas % 2;
    subtotalTotal += (paresCrucesRosas * 1500) + (sueltosCrucesRosas * 900);

    // 🌟 PROMO SEÑALADORES: Espadas (2 x $1800, sueltas $1000)
    const paresEspadas = Math.floor(contadorEspadas / 2);
    const sueltasEspadas = contadorEspadas % 2;
    subtotalTotal += (paresEspadas * 1800) + (sueltasEspadas * 1000);

    // 🌟 PROMO LÁMINAS 1: Set Hebreo (Cada grupo de 4 vale $4000, sueltas $1500)
    const setsHebreo = Math.floor(contadorHebreo / 4);
    const sueltasHebreo = contadorHebreo % 4;
    subtotalTotal += (setsHebreo * 4000) + (sueltasHebreo * 1500);

    // 🌟 PROMO LÁMINAS 2: Set Cristiano Urbano (Cada grupo de 3 vale $4000, sueltas $1500)
    const setsUrbano = Math.floor(contadorUrbano / 3);
    const sueltasUrbano = contadorUrbano % 3;
    subtotalTotal += (setsUrbano * 4000) + (sueltasUrbano * 1500);

    // 🌟 PROMO LÁMINAS 3: Set Foil Varios (Cada grupo de 3 vale $3500, sueltas $1500)
    const setsFoilVarios = Math.floor(contadorFoilVarios / 3);
    const sueltasFoilVarios = contadorFoilVarios % 3;
    subtotalTotal += (setsFoilVarios * 3500) + (sueltasFoilVarios * 1500);

    return subtotalTotal;
}

/**
 * Vacía por completo el carrito de compras (útil para cuando finalice el pedido).
 */
function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnStorage();
    console.log("🧹 Carrito completamente vaciado.");
}