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
        let preciosBase = { 'cruce-rosa': 0, 'espada': 0, 'set-hebreo': 0, 'set-urbano': 0, 'set-foil-varios': 0 };
        let contadores = { 'cruce-rosa': 0, 'espada': 0, 'set-hebreo': 0, 'set-urbano': 0, 'set-foil-varios': 0 };

        datosCheckout.forEach(producto => {
            const precioLimpio = Number(producto.precio) || 0;
            const totalItem = precioLimpio * producto.cantidad;
            subtotalSinDescuento += totalItem;

            if (preciosBase.hasOwnProperty(producto.categoria)) {
                contadores[producto.categoria] += producto.cantidad;
                preciosBase[producto.categoria] = precioLimpio;
            }

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

        let subtotalConDescuento = 0;
        subtotalConDescuento += (Math.floor(contadores['cruce-rosa'] / 2) * (preciosBase['cruce-rosa'] * 1.66)) + ((contadores['cruce-rosa'] % 2) * preciosBase['cruce-rosa']);
        subtotalConDescuento += (Math.floor(contadores['espada'] / 2) * (preciosBase['espada'] * 1.8)) + ((contadores['espada'] % 2) * preciosBase['espada']);
        subtotalConDescuento += (Math.floor(contadores['set-hebreo'] / 4) * (preciosBase['set-hebreo'] * 2.66)) + ((contadores['set-hebreo'] % 4) * preciosBase['set-hebreo']);
        subtotalConDescuento += (Math.floor(contadores['set-urbano'] / 3) * (preciosBase['set-urbano'] * 2.1)) + ((contadores['set-urbano'] % 3) * preciosBase['set-urbano']);
        subtotalConDescuento += (Math.floor(contadores['set-foil-varios'] / 3) * (preciosBase['set-foil-varios'] * 2.05)) + ((contadores['set-foil-varios'] % 3) * preciosBase['set-foil-varios']);

        datosCheckout.forEach(p => {
            if (!preciosBase.hasOwnProperty(p.categoria)) subtotalConDescuento += (Number(p.precio) || 0) * p.cantidad;
        });

        const ahorroTotal = subtotalSinDescuento - subtotalConDescuento;
        txtSubtotal.textContent = `$${subtotalSinDescuento.toLocaleString()}`;
        txtDescuento.textContent = ahorroTotal > 0 ? `-$${Math.round(ahorroTotal).toLocaleString()}` : `-$0`;
        txtTotal.textContent = `$${Math.round(subtotalConDescuento).toLocaleString()}`;
    }

    // LÓGICA DE ENVÍO Y OCULTAR EFECTIVO
    const PRECIO_ENVIO_LOCAL = 4500;
    const PRECIO_ENVIO_NACIONAL = 6800;
    let costoEnvioActual = 0;

    function calcularCostoPorCP(cp) {
        const n = parseInt(cp);
        return ((n >= 1000 && n <= 1999) || (n >= 6000 && n <= 8999)) ? PRECIO_ENVIO_LOCAL : PRECIO_ENVIO_NACIONAL;
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
        cargarResumenCheckout();
        const formaEntregaActiva = document.querySelector('input[name="forma-entrega"]:checked');
        if (formaEntregaActiva && formaEntregaActiva.value === 'envio') {
            let subtotalConDescuento = parseFloat(txtTotal.textContent.replace('$', '').replace('.', '')) || 0;
            txtTotal.textContent = `$${(subtotalConDescuento + costoEnvioActual).toLocaleString()}`;
        }
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