// --- FUNCIONES GLOBALES (FUERA DEL EVENTO) ---
function cerrarModal() {
    document.getElementById('modal-pago').style.display = 'none';
}

function abrirModal(titulo, mensaje, mostrarDatos, esTransferencia = false) {
    document.getElementById('titulo-modal').textContent = titulo;
    document.getElementById('mensaje-modal').textContent = mensaje;
    document.getElementById('datos-bancarios').style.display = mostrarDatos ? 'block' : 'none';
    
    // Configuración del botón de WhatsApp
    const btnWpp = document.getElementById('btn-wpp-modal');
    btnWpp.style.display = 'block';
    
    if (esTransferencia) {
        btnWpp.href = "https://wa.me/5491166289178?text=Hola!%20Realicé%20la%20transferencia%20del%20pedido.";
        btnWpp.textContent = "Enviar comprobante por WhatsApp";
    } else {
        btnWpp.href = "https://wa.me/5491166289178?text=Hola!%20Tengo%20una%20consulta%20sobre%20mi%20pedido.";
        btnWpp.textContent = "Consultar por WhatsApp";
    }
    
    document.getElementById('modal-pago').style.display = 'flex';
}

emailjs.init("mNybPhj1LBKcTnrN8"); // La encontrás en tu panel EmailJS -> Account -> API Keys

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
        let cRosas = 0, cEspadas = 0, cHebreo = 0, cUrbano = 0, cFoil = 0;

        datosCheckout.forEach(producto => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-checkout';
            const costoItemBruto = producto.precio * producto.cantidad;
            subtotalSinDescuento += costoItemBruto;

            if (producto.categoria === 'cruce-rosa') cRosas += producto.cantidad;
            else if (producto.categoria === 'espada') cEspadas += producto.cantidad;
            else if (producto.categoria === 'set-hebreo') cHebreo += producto.cantidad;
            else if (producto.categoria === 'set-urbano') cUrbano += producto.cantidad;
            else if (producto.categoria === 'set-foil-varios') cFoil += producto.cantidad;

            itemDiv.innerHTML = `
                <img src="${producto.imagen || 'imagenes/default.jpg'}" alt="${producto.titulo}">
                <div class="item-detalles">
                    <p class="item-titulo">${producto.titulo}</p>
                    <p class="item-cantidad">Cant: ${producto.cantidad}</p>
                </div>
                <span class="item-precio">$${costoItemBruto}</span>
            `;
            contenedorItems.appendChild(itemDiv);
        });

        let subtotalConDescuento = 0;
        subtotalConDescuento += (Math.floor(cRosas / 2) * 1500) + ((cRosas % 2) * 900);
        subtotalConDescuento += (Math.floor(cEspadas / 2) * 1800) + ((cEspadas % 2) * 1000);
        subtotalConDescuento += (Math.floor(cHebreo / 4) * 4000) + ((cHebreo % 4) * 1500);
        subtotalConDescuento += (Math.floor(cUrbano / 3) * 4000) + ((cUrbano % 3) * 1500);
        subtotalConDescuento += (Math.floor(cFoil / 3) * 3500) + ((cFoil % 3) * 1500);

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

    formPedido.addEventListener('submit', async (e) => {
        e.preventDefault();
        const metodoElegido = document.querySelector('input[name="forma-pago"]:checked')?.value;

        if (metodoElegido === 'transferencia') {
            abrirModal("¡Pedido Registrado!", "Realizá la transferencia con los datos y envianos el comprobante.", true, true);
            return;
        }

        if (metodoElegido === 'efectivo') {
            abrirModal("¡Pedido Registrado!", "Recordá que el pago es presencial en: Calle Pola 682, CABA.", false, false);
            return;
        }

        const boton = formPedido.querySelector('button[type="submit"]');
        const textoTotal = txtTotal.textContent;
        const totalFinal = Number(textoTotal.replace("$", "").replace(/\./g, "").replace(",", ".").trim());

        boton.disabled = true;
        boton.textContent = "Conectando...";

// Ejemplo de cómo disparar el envío
emailjs.send('service_izruv7a', '__ejs-test-mail-service__', {
    nombre: document.getElementById('checkout-nombre').value,
    email: document.getElementById('checkout-email').value,
    lista_productos: datosCheckout.map(p => `${p.titulo} x${p.cantidad}`).join(', '),
    total: txtTotal.textContent,
    metodo_pago: document.querySelector('input[name="forma-pago"]:checked').value,
    forma_entrega: document.querySelector('input[name="forma-entrega"]:checked').value,
    datos_envio: document.getElementById('checkout-direccion')?.value || "Retiro en local"
})
.then(() => console.log("¡Email enviado con éxito!"))
.catch(err => console.error("Error al enviar email:", err));

        try {
            const respuesta = await fetch("https://taleh-api.onrender.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ total: totalFinal })
            });
            const data = await respuesta.json();
            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                alert("Error al conectar con Mercado Pago.");
                boton.disabled = false;
                boton.textContent = "CONFIRMAR PEDIDO";
            }
        } catch (err) {
            alert("Error de red.");
            boton.disabled = false;
            boton.textContent = "CONFIRMAR PEDIDO";
        }
    });

    cargarResumenCheckout();
});