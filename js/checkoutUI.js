// --- FUNCIONES GLOBALES ---
function cerrarModal() {
    document.getElementById('modal-pago').style.display = 'none';
}

function abrirModal(titulo, mensaje, mostrarDatos, esTransferencia = false) {
    document.getElementById('titulo-modal').textContent = titulo;
    
    // Agregamos la advertencia dentro del mensaje
    const advertencia = " Por favor, copien los datos o saquen captura de pantalla antes de continuar. Es necesario presionar 'Entendido' para confirmar el pedido.";
    document.getElementById('mensaje-modal').textContent = mensaje + advertencia;
    
    document.getElementById('datos-bancarios').style.display = mostrarDatos ? 'block' : 'none';
    
    const btnWpp = document.getElementById('btn-wpp-modal');
    btnWpp.style.display = 'block';
    
    // Configuración inicial del botón
    btnWpp.textContent = "Entendido";
    btnWpp.href = "#";
    btnWpp.onclick = function(e) {
        e.preventDefault();
        finalizarPedido(esTransferencia); // Le pasamos si es transferencia para configurar el botón después
    };
    
    document.getElementById('modal-pago').style.display = 'flex';
}

// --- NUEVA FUNCIÓN PARA ENVIAR MAIL AL HACER CLIC EN "ENTENDIDO" ---
function finalizarPedido(esTransferencia) {
    const esEnvio = document.querySelector('input[name="forma-entrega"][value="envio"]').checked;
    const dir = esEnvio ? 
        `${document.getElementById('checkout-calle').value} ${document.getElementById('checkout-numero').value}, ${document.getElementById('checkout-depto').value || ''} - ${document.getElementById('checkout-localidad').value}, ${document.getElementById('checkout-provincia').value} (CP: ${document.getElementById('checkout-cp').value})` 
        : "Retiro en local";

    // Mostramos estado de carga
    const btnWpp = document.getElementById('btn-wpp-modal');
    btnWpp.textContent = "Enviando pedido...";
    btnWpp.onclick = null;

    emailjs.send('service_izruv7a', 'template_3wgwcyl', {
        nombre: document.getElementById('checkout-nombre').value,
        email: document.getElementById('checkout-email').value,
        celular: document.getElementById('checkout-celular').value,
        lista_productos: JSON.parse(localStorage.getItem('taleh_carrito')).map(p => `${p.titulo} x${p.cantidad}`).join(', '),
        total: document.getElementById('resumen-total-general').textContent,
        metodo_pago: document.querySelector('input[name="forma-pago"]:checked').value,
        forma_entrega: document.querySelector('input[name="forma-entrega"]:checked').value,
        datos_envio: dir
    }).then(() => {
        console.log("Email enviado tras confirmación");
        
        // Cambiamos el mensaje para avisar que se envió correctamente
        document.getElementById('titulo-modal').textContent = "¡Pedido Enviado!";
        document.getElementById('mensaje-modal').textContent = "Tu pedido fue registrado. Si realizaste transferencia, hacé clic abajo para enviarnos el comprobante.";
        
        // Cambiamos el botón a WhatsApp
        btnWpp.textContent = esTransferencia ? "Enviar comprobante por WhatsApp" : "Contactar por WhatsApp";
        btnWpp.href = "https://wa.me/5491166289178?text=Hola!%20Realicé%20el%20pedido%20y%20aquí%20adjunto%20el%20comprobante.";
        btnWpp.onclick = null; // Ya no hace falta disparar el mail otra vez
        
    }).catch(err => {
        console.error("Error al enviar:", err);
        alert("Hubo un error al enviar el pedido, intentá nuevamente.");
        btnWpp.textContent = "Entendido";
        btnWpp.onclick = () => finalizarPedido(esTransferencia);
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
        let cRosas = 0, cEspadas = 0, cHebreo = 0, cUrbano = 0, cFoil = 0;

        datosCheckout.forEach(producto => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-checkout';
            
            subtotalSinDescuento += producto.precio * producto.cantidad;

            if (producto.categoria === 'cruce-rosa') cRosas += producto.cantidad;
            else if (producto.categoria === 'espada') cEspadas += producto.cantidad;
            else if (producto.categoria === 'set-hebreo') cHebreo += producto.cantidad;
            else if (producto.categoria === 'set-urbano') cUrbano += producto.cantidad;
            else if (producto.categoria === 'set-foil-varios') cFoil += producto.cantidad;

            itemDiv.innerHTML = `<img src="${producto.imagen || 'imagenes/default.jpg'}"><div class="item-detalles"><p class="item-titulo">${producto.titulo}</p><p class="item-cantidad">Cant: ${producto.cantidad}</p></div><span class="item-precio">$${producto.precio * producto.cantidad}</span>`;
            contenedorItems.appendChild(itemDiv);
        });

        let subtotalConDescuento = 0;
        subtotalConDescuento += (Math.floor(cRosas / 2) * 1500) + ((cRosas % 2) * 900);
        subtotalConDescuento += (Math.floor(cEspadas / 2) * 1800) + ((cEspadas % 2) * 1000);
        subtotalConDescuento += (Math.floor(cHebreo / 4) * 4000) + ((cHebreo % 4) * 1500);
        subtotalConDescuento += (Math.floor(cUrbano / 3) * 4000) + ((cUrbano % 3) * 1900);
        subtotalConDescuento += (Math.floor(cFoil / 3) * 3500) + ((cFoil % 3) * 1700);

        datosCheckout.forEach(p => {
            if (!['cruce-rosa', 'espada', 'set-hebreo', 'set-urbano', 'set-foil-varios'].includes(p.categoria)) {
                subtotalConDescuento += p.precio * p.cantidad;
            }
        });

        const ahorroTotal = subtotalSinDescuento - subtotalConDescuento;
        txtSubtotal.textContent = `$${subtotalSinDescuento}`;
        txtDescuento.textContent = `-$${ahorroTotal}`;
        txtTotal.textContent = `$${subtotalConDescuento}`;
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