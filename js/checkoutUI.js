document.addEventListener('DOMContentLoaded', () => {
    let datosCheckout = JSON.parse(localStorage.getItem('taleh_carrito')) || [];
    
    const contenedorItems = document.getElementById('items-resumen-checkout');
    const bloqueDireccion = document.getElementById('checkout-bloque-direccion');
    const formPedido = document.getElementById('formulario-checkout-real');

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
        let contadorCrucesRosas = 0, contadorEspadas = 0, contadorHebreo = 0, contadorUrbano = 0, contadorFoilVarios = 0;

        datosCheckout.forEach(producto => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-checkout';
            const costoItemBruto = producto.precio * producto.cantidad;
            subtotalSinDescuento += costoItemBruto;

            if (producto.categoria === 'cruce-rosa') contadorCrucesRosas += producto.cantidad;
            else if (producto.categoria === 'espada') contadorEspadas += producto.cantidad;
            else if (producto.categoria === 'set-hebreo') contadorHebreo += producto.cantidad;
            else if (producto.categoria === 'set-urbano') contadorUrbano += producto.cantidad;
            else if (producto.categoria === 'set-foil-varios') contadorFoilVarios += producto.cantidad;

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
        subtotalConDescuento += (Math.floor(contadorCrucesRosas / 2) * 1500) + ((contadorCrucesRosas % 2) * 900);
        subtotalConDescuento += (Math.floor(contadorEspadas / 2) * 1800) + ((contadorEspadas % 2) * 1000);
        subtotalConDescuento += (Math.floor(contadorHebreo / 4) * 4000) + ((contadorHebreo % 4) * 1500);
        subtotalConDescuento += (Math.floor(contadorUrbano / 3) * 4000) + ((contadorUrbano % 3) * 1500);
        subtotalConDescuento += (Math.floor(contadorFoilVarios / 3) * 3500) + ((contadorFoilVarios % 3) * 1500);

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

    document.querySelectorAll('input[name="forma-entrega"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const inputCP = document.getElementById('checkout-cp');
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
            let subtotalConDescuento = parseFloat(txtTotal.textContent.replace('$', '')) || 0;
            txtTotal.textContent = `$${subtotalConDescuento + costoEnvioActual}`;
        }
    }
formPedido.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const boton = formPedido.querySelector('button[type="submit"]');
const textoTotal = document.getElementById('resumen-total-general').textContent;

const totalFinal = Number(
    textoTotal
        .replace("$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim()
);

console.log("TOTAL:", totalFinal);
console.log("TIPO:", typeof totalFinal);
    const nombreCliente = document.getElementById('checkout-nombre').value;
    
    boton.disabled = true;
    boton.textContent = "Conectando...";

// ... dentro de tu evento submit ...
try {
    const respuesta = await fetch("https://taleh-api.onrender.com/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: totalFinal })
    });

    const data = await respuesta.json();

    if (data.init_point) {
        window.location.href = data.init_point; // Esto abre Mercado Pago
    } else {
        console.error(data);
        alert("Error al conectar con Mercado Pago.");
    }
} catch (err) {
    console.error("Error:", err);
    alert("Error de red.");
}
});

    cargarResumenCheckout();
});
