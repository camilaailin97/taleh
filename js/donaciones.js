// Variable global para guardar qué tipo de donación se eligió
let tipoDonacionActual = '';

function iniciarDonacion(tipo) {
    tipoDonacionActual = tipo;
    document.getElementById('modal-donacion').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-donacion').style.display = 'none';
}

function procesarDonacion() {
    const monto = document.getElementById('input-monto').value;
    if (!monto || monto <= 0) return alert("Por favor ingresa un monto válido");

    // Aquí llamamos a tu API de Render igual que antes
    fetch('https://taleh-api.onrender.com/donacion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: tipoDonacionActual, monto: parseFloat(monto) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.init_point) {
            window.location.href = data.init_point;
        } else {
            alert("Hubo un error al generar el pago.");
        }
    });
}

document.getElementById('formulario-oracion').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    const boton = document.getElementById('boton-enviar');
    boton.innerText = "Enviando...";
    boton.disabled = true;

    fetch('https://formspree.io/f/mzdnzwge', {
        method: 'POST',
        body: new FormData(e.target),
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            // Ocultamos el formulario y mostramos el mensaje de éxito
            document.getElementById('formulario-oracion').style.display = 'none';
            document.getElementById('mensaje-exito').style.display = 'block';
        } else {
            alert("Hubo un error al enviar, intenta nuevamente.");
            boton.innerText = "Enviar al Muro";
            boton.disabled = false;
        }
    });
});
