// --- FUNCIONES GLOBALES ---
function cerrarModal() {
    document.getElementById('modal-pago').style.display = 'none';
}

function abrirModal(titulo, mensaje, mostrarDatos, esTransferencia = false, esEfectivo = false) {
    document.getElementById('titulo-modal').textContent = titulo;
    
    // Si es efectivo, no mostramos la advertencia
    const advertencia = esEfectivo ? "" : " Por favor, copien los datos o saquen captura de pantalla antes de continuar. Es necesario presionar 'Entendido' para confirmar el pedido.";
    document.getElementById('mensaje-modal').textContent = mensaje + advertencia;
    
    document.getElementById('datos-bancarios').style.display = mostrarDatos ? 'block' : 'none';
    
    const btnWpp = document.getElementById('btn-wpp-modal');
    const btnEntendido = document.getElementById('btn-entendido-modal');
    
    btnWpp.style.display = 'none';
    btnEntendido.style.display = 'inline-block';
    btnEntendido.textContent = "Entendido";
    btnEntendido.disabled = false;
    btnEntendido.onclick = function() {
        finalizarPedido(esTransferencia);
    };
    
    document.getElementById('modal-pago').style.display = 'flex';
}

function finalizarPedido(esTransferencia) {
    const btnEntendido = document.getElementById('btn-entendido-modal');
    const btnWpp = document.getElementById('btn-wpp-modal');

    btnEntendido.textContent = "Enviando...";
    btnEntendido.disabled = true;

    emailjs.send('service_izruv7a', 'template_3wgwcyl', {
        nombre: document.getElementById('checkout-nombre').value,
        email: document.getElementById('checkout-email').value,
        celular: document.getElementById('checkout-celular').value,
        lista_productos: JSON.parse(localStorage.getItem('taleh_carrito')).map(p => `${p.titulo} x${p.cantidad}`).join(', '),
        total: document.getElementById('resumen-total-general').textContent,
        metodo_pago: document.querySelector('input[name="forma-pago"]:checked').value,
        forma_entrega: document.querySelector('input[name="forma-entrega"]:checked').value
    }).then(() => {
        btnEntendido.style.display = 'none';
        document.getElementById('titulo-modal').textContent = "¡Pedido Registrado!";
        document.getElementById('mensaje-modal').textContent = esTransferencia 
            ? "Tu pedido fue registrado. Realizá la transferencia y hacé clic abajo para enviarnos el comprobante."
            : "Tu pedido fue registrado. Si tenés alguna duda sobre el retiro, consultanos por WhatsApp.";
        
        btnWpp.style.display = 'block';
        btnWpp.textContent = esTransferencia ? "Enviar comprobante" : "Consultar por WhatsApp";
        btnWpp.href = "https://wa.me/5491166289178?text=Hola!%20Realicé%20el%20pedido.";
    }).catch(err => {
        alert("Error al enviar. Intentá nuevamente.");
        btnEntendido.textContent = "Entendido";
        btnEntendido.disabled = false;
    });
}
emailjs.init("mNybPhj1LBKcTnrN8");


// --- LÓGICA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
    let datosCheckout = JSON.parse(localStorage.getItem('taleh_carrito')) || [];
    
    const contenedorItems = document.getElementById('items-resumen-checkout');
    const bloqueDireccion = document.getElementById('checkout-bloque-direccion');
    const formPedido = document.getElementById('formulario-checkout-real');
    const inputCP = document.getElementById('checkout-cp');
    const txtSubtotal = document.getElementById('resumen-subtotal');
    const txtDescuento = document.getElementById('resumen-descuento');
    const txtEnvio = document.getElementById('resumen-envio');
    const txtTotal = document.getElementById('resumen-total-general');

    // --- AQUÍ EMPIEZA LA FUNCIÓN NUEVA ---
function cargarResumenCheckout() {
    if (!contenedorItems) return;
    contenedorItems.innerHTML = '';
    if (datosCheckout.length === 0) {
        contenedorItems.innerHTML = '<p style="text-align:center; color:rgba(43,29,15,0.5);">Tu carrito está vacío.</p>';
        return;
    }

    let subtotalSinDescuento = 0;
    
    // Almacenamos el precio unitario encontrado para usarlo en la promo
    let preciosBase = { 'cruce-rosa': 0, 'espada': 0, 'set-hebreo': 0, 'set-urbano': 0, 'set-foil-varios': 0 };
    let contadores = { 'cruce-rosa': 0, 'espada': 0, 'set-hebreo': 0, 'set-urbano': 0, 'set-foil-varios': 0 };

    datosCheckout.forEach(producto => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-checkout';
        
        subtotalSinDescuento += producto.precio * producto.cantidad;

        // Si es producto con promo, guardamos el contador y su precio real
        if (preciosBase.hasOwnProperty(producto.categoria)) {
            contadores[producto.categoria] += producto.cantidad;
            preciosBase[producto.categoria] = producto.precio;
        }

        itemDiv.innerHTML = `<img src="${producto.imagen || 'imagenes/default.jpg'}"><div class="item-detalles"><p class="item-titulo">${producto.titulo}</p><p class="item-cantidad">Cant: ${producto.cantidad}</p></div><span class="item-precio">$${producto.precio * producto.cantidad}</span>`;
        contenedorItems.appendChild(itemDiv);
    });

    // CÁLCULO DINÁMICO (Usa los precios reales almacenados en preciosBase)
    let subtotalConDescuento = 0;
    
    // Promo: 2 unidades (Ej: Cruces/Rosas)
    subtotalConDescuento += (Math.floor(contadores['cruce-rosa'] / 2) * (preciosBase['cruce-rosa'] * 1.66)) + ((contadores['cruce-rosa'] % 2) * preciosBase['cruce-rosa']);
    // Promo: 2 unidades (Ej: Espadas)
    subtotalConDescuento += (Math.floor(contadores['espada'] / 2) * (preciosBase['espada'] * 1.8)) + ((contadores['espada'] % 2) * preciosBase['espada']);
    // Promo: 4 unidades (Ej: Hebreo)
    subtotalConDescuento += (Math.floor(contadores['set-hebreo'] / 4) * (preciosBase['set-hebreo'] * 2.66)) + ((contadores['set-hebreo'] % 4) * preciosBase['set-hebreo']);
    // Promo: 3 unidades (Ej: Urbano)
    subtotalConDescuento += (Math.floor(contadores['set-urbano'] / 3) * (preciosBase['set-urbano'] * 2.1)) + ((contadores['set-urbano'] % 3) * preciosBase['set-urbano']);
    // Promo: 3 unidades (Ej: Foil)
    subtotalConDescuento += (Math.floor(contadores['set-foil-varios'] / 3) * (preciosBase['set-foil-varios'] * 2.05)) + ((contadores['set-foil-varios'] % 3) * preciosBase['set-foil-varios']);

    // Sumar productos normales (que no entran en promos)
    datosCheckout.forEach(p => {
        if (!preciosBase.hasOwnProperty(p.categoria)) {
            subtotalConDescuento += p.precio * p.cantidad;
        }
    });

    const ahorroTotal = subtotalSinDescuento - subtotalConDescuento;
    txtSubtotal.textContent = `$${subtotalSinDescuento}`;
    txtDescuento.textContent = ahorroTotal > 0 ? `-$${Math.round(ahorroTotal)}` : `-$0`;
    txtTotal.textContent = `$${Math.round(subtotalConDescuento)}`;
}


    // --- LÓGICA DE ENVÍO Y CÁLCULOS ---
    const PRECIO_ENVIO_LOCAL = 4500;
    const PRECIO_ENVIO_NACIONAL = 6800;
    let costoEnvioActual = 0;

    function calcularCostoPorCP(cp) {
        const n = parseInt(cp);
        return ((n >= 1000 && n <= 1999) || (n >= 6000 && n <= 8999)) ? PRECIO_ENVIO_LOCAL : PRECIO_ENVIO_NACIONAL;
    }

    if (inputCP) {
        inputCP.addEventListener('input', () => {
            const nuevoCosto = calcularCostoPorCP(inputCP.value);
            const radioEnvio = document.querySelector('input[name="forma-entrega"][value="envio"]');
            if (radioEnvio && radioEnvio.checked) {
                costoEnvioActual = (inputCP.value.trim().length >= 4) ? nuevoCosto : 0;
                txtEnvio.textContent = (costoEnvioActual > 0) ? `$${costoEnvioActual}` : "Ingresá tu CP";
            }
            actualizarTotalFinal();
        });
    }

    document.querySelectorAll('input[name="forma-entrega"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'envio') {
                bloqueDireccion.style.display = 'block';
                inputCP.required = true;
                costoEnvioActual = (inputCP.value.trim() !== '') ? calcularCostoPorCP(inputCP.value) : 0;
                txtEnvio.textContent = (costoEnvioActual > 0) ? `$${costoEnvioActual}` : "Ingresá tu CP";
            } else {
                bloqueDireccion.style.display = 'none';
                inputCP.required = false;
                costoEnvioActual = 0;
                txtEnvio.textContent = "Gratis";
            }
            actualizarTotalFinal();
        });
    });

    function actualizarTotalFinal() {
        cargarResumenCheckout();
        const formaEntregaActiva = document.querySelector('input[name="forma-entrega"]:checked');
        if (formaEntregaActiva && formaEntregaActiva.value === 'envio') {
            let subtotalConDescuento = parseFloat(txtTotal.textContent.replace('$', '').replace('.', '')) || 0;
            txtTotal.textContent = `$${subtotalConDescuento + costoEnvioActual}`;
        }
    }

    // --- EVENTO SUBMIT (SOLO MODAL O MERCADO PAGO) ---
    formPedido.addEventListener('submit', async (e) => {
        e.preventDefault();
        const metodoElegido = document.querySelector('input[name="forma-pago"]:checked')?.value;

        if (metodoElegido === 'transferencia' || metodoElegido === 'efectivo') {
            abrirModal("¡Pedido Registrado!", metodoElegido === 'transferencia' ? "Realizá la transferencia y envianos el comprobante." : "Recordá que el pago es presencial en: Calle Pola 682, CABA.", metodoElegido === 'transferencia', metodoElegido === 'transferencia');
            return;
        }

        // Lógica Mercado Pago (envía mail aquí porque no usa el botón Entendido)
        const boton = formPedido.querySelector('button[type="submit"]');
        const totalFinal = Number(txtTotal.textContent.replace("$", "").replace(/\./g, "").replace(",", ".").trim());
        boton.disabled = true;
        boton.textContent = "Conectando...";
        
        // Disparo el mail aquí porque Mercado Pago redirige
        finalizarPedido(); 

        try {
            const respuesta = await fetch("https://taleh-api.onrender.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ total: totalFinal })
            });
            const data = await respuesta.json();
            if (data.init_point) { window.location.href = data.init_point; }
            else { alert("Error al conectar con Mercado Pago."); boton.disabled = false; boton.textContent = "CONFIRMAR PEDIDO"; }
        } catch (err) { alert("Error de red."); boton.disabled = false; boton.textContent = "CONFIRMAR PEDIDO"; }
    });

    cargarResumenCheckout();
});