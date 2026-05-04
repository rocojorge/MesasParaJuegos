const pasos = ['Material', 'Color', 'Tapete', 'Cajón', 'Lámina', 'LEDs', 'Cierre magnético'];
let pasoActual = 0;
const seleccion = {};

const opciones = {
    Material: ['Roble', 'Nogal', 'Pino'],
    Color: ['Natural', 'Oscuro', 'Blanco'],
    Tapete: ['Rojo', 'Azul', 'Verde'],
    Cajón: ['Sí', 'No'],
    Lámina: ['Transparente', 'Opaca'],
    LEDs: ['Sí', 'No'],
    'Cierre magnético': ['Sí', 'No']
};

function renderPaso() {
    document.getElementById('titulo-paso').textContent = pasos[pasoActual];

    const contenedor = document.getElementById('opciones');
    contenedor.innerHTML = opciones[pasos[pasoActual]].map(op => `
        <label class="opcion">
            <input type="radio" name="opcion" value="${op}" ${seleccion[pasos[pasoActual]] === op ? 'checked' : ''}>
            ${op}
        </label>
    `).join('');

    document.querySelectorAll('.paso').forEach((p, i) => {
        p.classList.toggle('activo', i === pasoActual);
    });
}

document.getElementById('btn-siguiente').addEventListener('click', () => {
    const elegida = document.querySelector("input[name='opcion']:checked");

    if (!elegida) {
        alert('Selecciona una opción para continuar');
        return;
    }

    seleccion[pasos[pasoActual]] = elegida.value;

    if (pasoActual < pasos.length - 1) {
        pasoActual++;
        renderPaso();
    } else {
        mostrarResumen();
    }
});

function mostrarResumen() {
    const resumen = Object.entries(seleccion)
        .map(([clave, valor]) => `<li><strong>${clave}:</strong> ${valor}</li>`)
        .join('');

    document.querySelector('.config-layout').innerHTML = `
        <section class="panel">
            <h2>Resumen de tu configuración</h2>
            <p>Tu mesa está lista para enviarse como solicitud de presupuesto.</p>
            <ul>${resumen}</ul>
            <a class="btn-primary" href="contacto.html">Solicitar presupuesto</a>
        </section>
    `;
}

renderPaso();
