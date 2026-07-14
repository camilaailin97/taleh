/**
 * Abre el modal de reflexión con un efecto de animación.
 * @param {string} titulo - El título de la reflexión.
 * @param {string} texto - El contenido completo de la reflexión.
 */
function abrirReflexion(titulo, texto) {
    const modal = document.getElementById('modal-reflexion');
    const contenido = document.getElementById('contenido-reflexion');
    
    contenido.style.opacity = "0";
contenido.innerHTML = `
        <h2 style="font-family: 'Cinzel Decorative', cursive; color: #5d4037;">${titulo}</h2>
        <p style="font-family: 'Almendra', serif; line-height: 1.6; color: #3e2723;">${texto}</p>
    `;
    
    modal.style.display = "flex";
    
    setTimeout(() => {
        modal.classList.add('activo');
        
        // Esperamos 1000ms (1 segundo) para que el texto aparezca 
        // cuando el pergamino ya esté bastante abierto
        setTimeout(() => {
            contenido.style.transition = "opacity 0.8s ease";
            contenido.style.opacity = "1";
        }, 1000); 
    }, 10);
}

function mostrarReflexionTema() {
    abrirReflexion('Tema del mes', `
        <p>Paz en la Tormenta...</p>
        <div style="text-align: center;">
            <img src="imagenes/seccion-reflexiones/tema-del-mes/tamuz.png" style="width:40%; border-radius:8px; margin: 40px auto; display:block;">
        </div>
        <p>Cuando lloras por las veces que intentaste <br>
            Y tratas de olvidar las lágrimas que lloraste <br>
            Solo tienes pena y tristeza <br>
            El futuro incierto espera <br>
            Puedes tener <br>
            Paz en la tormenta <br>
            Muchas veces yo me siento igual que tú <br>
            Y mi corazón, anhela algo real <br>
            El Señor viene a mí <br>
            Y me ayuda a seguir <br>
            En paz <br>
            En medio de la tormenta <br>
            Puedes tener <br>
            Paz en la tormenta <br>
            Fe y esperanza <br>
            Cuando no puedas seguir <br>
            Aún con tu mundo hecho pedazos <br>
            El Señor guiará tus pasos <br>
            En paz <br>
            En medio de la tormenta...</p>
    `);
}


function mostrarReflexionTamuz() {
    abrirReflexion('Mes Bíblico de Tamuz', `
        <p>Enseñanza de Tamuz...</p>
        <div style="text-align: center;">
            <img src="imagenes/seccion-reflexiones/tema-del-mes/ilustracion-tamuz.png" style="width:60%; border-radius:8px; margin: 40px auto; display:block;">
        </div>
        <p>En ocasiones, tenemos que lidiar en la vida con la convergencia de múltiples crisis o circunstancias difíciles. Es cuando todo converge: tu hijo se enferma, el auto se descompone, no encuentras Uber y, a la vez, llueve a cántaros; encima, tu pareja o tus padres no contestan los mensajes. Una o dos cosas de estas por separado no son tan malas, pero cuando llegan juntas conforman una gran tormenta. Puede ser en el trabajo, en la casa o en la economía. Es cuando nos preguntamos: <strong>"Señor, ¿cuánto más puedo soportar? ¡Necesito un respiro!"</strong><br><br>

Esto puede suceder en cualquier ámbito. Es cuando llegamos al punto límite y nos preguntamos si permaneceremos a flote o nos vamos a hundir.<br><br>

Cuando vamos a las Escrituras, en Mateo, Marcos y Lucas, un tranquilo paseo en barco se convierte en un entrenamiento aterrador frente a la muerte. De repente, una tormenta feroz se levanta en el mar de Galilea, sin avisar. No obstante, ¿Jesús había guiado a sus muchachos directamente hacia una tormenta?<br><br>

No es la falta de tormentas lo que nos distingue por seguir a Cristo. Tenemos tormentas como cualquier otra persona, las mismas o incluso peores. Lo que nos distingue es a quién tenemos con nosotros durante la tormenta.<br><br>

Grábate esto: podemos estar en una terrible tormenta y, aun así, estar en la voluntad de Dios. Tendemos a creer que, si estamos atravesando una tormenta, es porque nos movimos de la voluntad de Dios, porque "algo habré hecho mal". Pero, a veces, estás en medio de una tormenta justamente porque estás en el centro de la voluntad de Dios.<br><br>

Cuando Dios está sobre tu vida empieza a procesarte para ver qué tal eres como piloto de tormentas. Y ahora, en medio de la tormenta, los discípulos gritan y Jesús duerme. Le gritan: <strong>"Maestro, ¿no ves que perecemos? ¿No tienes cuidado de nuestra vida? ¿No te importa?"</strong> Todas esas preguntas las hace el miedo.<br><br>

El miedo corroe nuestra confianza en la bondad de Dios. Comenzamos a preguntarnos si acaso Dios puede dormir durante nuestras tormentas. "Señor, ¿yo no te importo?" El miedo desata una multitud de dudas y también afecta nuestra memoria.<br><br>

O sea, creemos en Dios, la mayoría sí, pero ¿estamos seguros de su presencia con nosotros? Emanuel, Dios con nosotros. ¿Qué significa Dios contigo de lunes a domingo? Todo el tiempo. Él no está ausente durante la tormenta. Conoce cada pensamiento, cada suspiro y cada sentimiento de nuestro corazón.<br><br>

Jesús se despertó, reprendió al viento y les dijo a las olas: <strong>"¡Silencio! ¡Cálmense!"</strong> Y el viento se detuvo. Entonces hubo una gran calma.<br><br>

Vivimos en un mundo tormentoso, donde creemos que podemos controlar todo, hasta que de repente aparece algo que ya no podemos controlar porque no depende de nosotros. Eso es lo que nos produce cierto miedo en la vida.<br><br>

El resultado de las tormentas es fortalecer nuestra fe. Jesús les enseña a los discípulos a tener fe y les hace dos preguntas. La primera: <strong>"¿Por qué tienen miedo?"</strong> Y la segunda: <strong>"¿Todavía no tienen fe?"</strong> (Marcos 4:40).<br><br>

Aquí hay una verdad espiritual clave: lo opuesto a la fe no es la incredulidad; lo opuesto a la fe es el miedo. La fe engendra confianza; el miedo genera temor paralizante.<br><br>

Entonces dijeron: <strong>"¿Quién es este hombre, que hasta el viento y el mar le obedecen?"</strong> Y ahí se dieron cuenta de que estaban delante de una presencia, de un poder que residía en una persona más poderosa que la violencia de un mar tormentoso.<br><br>

Pero todavía seguían sin darse cuenta, porque dijeron: <strong>"¿Qué clase de hombre es este?"</strong> y no <strong>"¿Qué clase de Dios es este?"</strong> Ya no estaban preocupados por hundirse; estaban impresionados con Jesús. Los temores debilitantes estaban siendo reemplazados por un temor fortalecedor hacia Dios.<br><br>

Y esto quiero que te grabes: cuando le temes a Dios, no le temes a nada más ni a nadie. Le temes a Dios y no le temes a nada más.<br><br>

Hoy disponemos de este Dios a través del Espíritu Santo. Aférrate a Él, agárrate de su mano, no lo sueltes y verás grandes milagros durante este mes.<br><br>

Bendigo este ejercicio de capitanes de navío. Que reciban doble porción del Espíritu. Bendigo la tormenta y todo lo grande que está por venir, y declaro que terminaremos en puerto seguro, en el nombre de Jesús. Amén.
</p>
    `);
}

function cerrarModal() {
    const modal = document.getElementById('modal-reflexion');
    const contenido = document.getElementById('contenido-reflexion');
    
    contenido.style.opacity = "0";
    modal.classList.remove('activo');
    
    // Esperamos 1500ms (1.5 segundos) para que termine de cerrarse
    setTimeout(() => {
        modal.style.display = "none";
    }, 1500); 
}



// Opcional: Cerrar el modal si hacen clic fuera del pergamino (en el fondo oscuro)
window.onclick = function(event) {
    const modal = document.getElementById('modal-reflexion');
    if (event.target == modal) {
        cerrarModal();
    }
}