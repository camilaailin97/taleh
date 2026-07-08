// --- FUNCIONES GLOBALES ---
function cerrarModal() {
    document.getElementById('modal-pago').style.display = 'none';
}

function abrirModal(titulo, mensaje, mostrarDatos, esTransferencia = false, esEfectivo = false) {
    document.getElementById('titulo-modal').textContent = titulo;
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
    }).catch(() => {
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

    function cargarResumenCheckout() {
    if (!contenedorItems) return;
    contenedorItems.innerHTML = '';
    
    if (datosCheckout.length === 0) {
        contenedorItems.innerHTML = '<p style="text-align:center; color:rgba(43,29,15,0.5);">Tu carrito está vacío.</p>';
        return;
    }

    let subtotalSinDescuento = 0;

    datosCheckout.forEach(producto => {
        const precioLimpio = Number(producto.precio) || 0;
        const totalItem = precioLimpio * producto.cantidad;
        subtotalSinDescuento += totalItem;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-checkout';
        itemDiv.innerHTML = `
            <img src="${producto.imagen || 'imagenes/default.jpg'}">
            <div class="item-detalles">
                <p class="item-titulo">${producto.titulo}</p>
                <p class="item-cantidad">Cant: ${producto.cantidad}</p>
                <p class="item-precio-unitario">$${precioLimpio.toLocaleString()}</p>
            </div>
            <span class="item-precio-total">$${totalItem.toLocaleString()}</span>
        `;
        contenedorItems.appendChild(itemDiv);
    });

    // LLAMADA A LA FUNCIÓN UNIFICADA DE CARRITO.JS
    const subtotalConDescuento = obtenerSubtotalCarrito(); 

    // Calculamos el ahorro real
    const ahorroTotal = subtotalSinDescuento - subtotalConDescuento;

    // Actualizamos la interfaz con los valores calculados
    txtSubtotal.textContent = `$${subtotalSinDescuento.toLocaleString()}`;
    txtDescuento.textContent = ahorroTotal > 0 ? `-$${Math.round(ahorroTotal).toLocaleString()}` : `-$0`;
    txtTotal.textContent = `$${Math.round(subtotalConDescuento).toLocaleString()}`;
}

    // LÓGICA DE ENVÍO Y OCULTAR EFECTIVO
// Ajusta estos valores según tus costos reales actuales
    const PRECIO_CABA = 5500;
    const PRECIO_GBA = 7500;
    const PRECIO_NACIONAL = 11500;
    let costoEnvioActual = 0;

    function calcularCostoPorCP(cp) {
        const n = parseInt(cp);
        if (isNaN(n)) return PRECIO_NACIONAL;

        // CABA (1000 a 1499)
        if (n >= 1000 && n <= 1499) {
            return PRECIO_CABA;
        } 
        // GBA (1600 a 1899 aprox, depende tu zona de cobertura)
        else if (n >= 1600 && n <= 1899) {
            return PRECIO_GBA;
        } 
        // Resto del país
        else {
            return PRECIO_NACIONAL;
        }
    }

    document.querySelectorAll('input[name="forma-entrega"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const radioEfectivo = document.querySelector('input[value="efectivo"]').closest('label');
            if (e.target.value === 'envio') {
                bloqueDireccion.style.display = 'block';
                inputCP.required = true;
                radioEfectivo.style.display = 'none';
                if (document.querySelector('input[value="efectivo"]').checked) {
                    document.querySelector('input[value="transferencia"]').checked = true;
                }
                costoEnvioActual = (inputCP.value.trim() !== '') ? calcularCostoPorCP(inputCP.value) : 0;
                txtEnvio.textContent = (costoEnvioActual > 0) ? `$${costoEnvioActual}` : "Ingresá tu CP";
            } else {
                bloqueDireccion.style.display = 'none';
                inputCP.required = false;
                radioEfectivo.style.display = 'block';
                costoEnvioActual = 0;
                txtEnvio.textContent = "Gratis";
            }
            actualizarTotalFinal();
        });
    });

function actualizarTotalFinal() {
        // 1. Recalculamos el subtotal base desde la función del carrito
        const subtotalConDescuento = obtenerSubtotalCarrito(); 
        
        // 2. Definimos el valor a mostrar
        let totalFinal = subtotalConDescuento;

        const formaEntregaActiva = document.querySelector('input[name="forma-entrega"]:checked');
        if (formaEntregaActiva && formaEntregaActiva.value === 'envio') {
            totalFinal += costoEnvioActual;
        }

        // 3. Actualizamos el texto final una sola vez
        txtTotal.textContent = `$${totalFinal.toLocaleString()}`;
    }

    // EVENTO SUBMIT
    formPedido.addEventListener('submit', async (e) => {
        e.preventDefault();
        const metodoElegido = document.querySelector('input[name="forma-pago"]:checked')?.value;
        const boton = formPedido.querySelector('button[type="submit"]');

        if (metodoElegido === 'transferencia' || metodoElegido === 'efectivo') {
            abrirModal("¡Pedido Registrado!", metodoElegido === 'transferencia' ? "Realizá la transferencia y envianos el comprobante." : "Recordá que el pago es presencial en: Calle Pola 682, CABA.", metodoElegido === 'transferencia', metodoElegido === 'transferencia');
            return;
        }

        boton.disabled = true;
        boton.textContent = "Conectando...";
        
        let aviso = document.createElement('p');
        aviso.id = "aviso-espera";
        aviso.style.color = "#a5865e";
        aviso.style.fontSize = "0.9em";
        aviso.style.marginTop = "10px";
        aviso.textContent = "⌛ Estamos conectando con Mercado Pago. Por favor, no recargues la página ni cierres la ventana, esto puede demorar unos segundos.";
        boton.parentNode.appendChild(aviso);

        finalizarPedido(); 

        try {
            const totalFinal = Number(txtTotal.textContent.replace("$", "").replace(/\./g, "").replace(",", ".").trim());
            const respuesta = await fetch("https://taleh-api.onrender.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ total: totalFinal })
            });
            const data = await respuesta.json();
            if (data.init_point) { window.location.href = data.init_point; }
            else { throw new Error("Sin init_point"); }
        } catch (err) {
            aviso.remove();
            alert("Error al conectar con Mercado Pago."); 
            boton.disabled = false; 
            boton.textContent = "CONFIRMAR PEDIDO"; 
        }
    });

    if(inputCP) inputCP.addEventListener('input', actualizarTotalFinal);
    cargarResumenCheckout();
});