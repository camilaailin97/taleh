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