function iniciarDonacion(tipo) {
    // 1. Pedimos el monto al usuario
    const monto = prompt("¿Qué monto deseas donar?");
    
    if (!monto || monto <= 0) return; // Si cancela o pone 0, no hacemos nada

    // 2. Llamamos a tu API en Render (la que acabamos de configurar)
    fetch('https://taleh-api.onrender.com/donacion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            tipo: tipo, 
            monto: parseFloat(monto) 
        })
    })
    .then(response => response.json())
    .then(data => {
        // 3. Mercado Pago nos devuelve un link (init_point), redirigimos ahí
        if (data.init_point) {
            window.location.href = data.init_point;
        } else {
            alert("Hubo un error al generar el pago. Intenta de nuevo.");
        }
    })
    .catch(error => console.error('Error:', error));
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
