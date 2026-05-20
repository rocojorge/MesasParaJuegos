const basePath = window.location.pathname.includes('/pages/') ? '..' : '.';
const params = new URLSearchParams(window.location.search);
const mesaID = params.get('id');

let mesaSeleccionada = null;
let pasoActual = 0;
const configuracion = {};

const pasos = ['Material', 'Color', 'Tapete', 'Cajón', 'Lámina', 'LEDs', 'Cierre magnético'];
const clavesPaso = {
    Material: 'materiales',
    Color: 'colores',
    Tapete: 'tapetes',
    Cajón: 'cajon',
    Lámina: 'lamina',
    LEDs: 'leds',
    'Cierre magnético': 'cierre'
};

fetch(`${basePath}/data/productos.json`)
    .then(res => res.json())
    .then(data => {
        mesaSeleccionada = data.find(producto => producto.id === mesaID);

        if (!mesaSeleccionada) {
            document.querySelector('main').innerHTML = `
                <section class="titulo-pagina">
                    <h1>No se ha encontrado la mesa</h1>
                    <p>Vuelve al catálogo para seleccionar un modelo válido.</p>
                    <a class="btn-primary" href="../catalogo.html">Volver al catálogo</a>
                </section>
            `;
            return;
        }

        document.getElementById('titulo-mesa').textContent = `Configurando: ${mesaSeleccionada.nombre}`;
        document.getElementById('vista-3d').innerHTML = `
            <img
                src="../${mesaSeleccionada.imagen}"
                alt="${mesaSeleccionada.nombre}"
                onerror="this.parentElement.classList.add('sin-imagen'); this.remove();"
            >
        `;

        renderPaso();
    });

function renderPaso() {
    const tituloPaso = document.getElementById('titulo-paso');
    const opcionesDiv = document.getElementById('opciones');
    const paso = pasos[pasoActual];
    const opciones = mesaSeleccionada[clavesPaso[paso]] || [];
    const seleccionActual = configuracion[paso];

    tituloPaso.textContent = paso;
    opcionesDiv.innerHTML = opciones.map(opcion => `
        <label class="opcion">
            <input type="radio" name="opcion" value="${opcion}" ${seleccionActual === opcion ? 'checked' : ''}>
            <span>${opcion}</span>
        </label>
    `).join('');

    document.querySelectorAll('.paso').forEach((elemento, indice) => {
        elemento.classList.toggle('activo', indice === pasoActual);
    });
}

document.getElementById('btn-siguiente').addEventListener('click', () => {
    const seleccion = document.querySelector("input[name='opcion']:checked");

    if (!seleccion) {
        alert('Selecciona una opcion para continuar');
        return;
    }

    configuracion[pasos[pasoActual]] = seleccion.value;

    if (pasoActual < pasos.length - 1) {
        pasoActual += 1;
        renderPaso();
        return;
    }

    mostrarResumen();
});

function construirPayload() {
    return {
        mesa: {
            id: mesaSeleccionada.id,
            nombre: mesaSeleccionada.nombre,
            precio_base: mesaSeleccionada.precio_base
        },
        configuracion,
        generado_en: new Date().toISOString()
    };
}

function descargarConfiguracion() {
    const payload = construirPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = `${mesaSeleccionada.id}-configuracion.json`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
}

function mostrarResumen() {
    const listaHTML = Object.entries(configuracion)
        .map(([clave, valor]) => `
            <li class="config-item">
                <span class="config-label">${clave}</span>
                <span class="config-value">${valor}</span>
            </li>
        `)
        .join('');

    document.querySelector('.config-layout').innerHTML = `
        <div class="config-resumen">
            <h2>Resumen de tu configuración</h2>
            <div class="config-resumen-box">
                <h3>${mesaSeleccionada.nombre}</h3>
                <ul class="config-list">${listaHTML}</ul>
            </div>
            <div class="hero-actions">
                <button id="btn-descargar-config" class="btn-primary" type="button">Descargar configuración</button>
                <button id="btn-carrito" class="btn-secondary" type="button">Agregar al carrito</button>
                <a class="btn-secondary" href="contacto.html">Solicitar presupuesto</a>
            </div>
        </div>
    `;

    document.getElementById('btn-descargar-config').addEventListener('click', descargarConfiguracion);

    document.getElementById('btn-carrito').addEventListener('click', () => {
        if (!window.carritoAPI) {
            alert('El carrito no está disponible en este momento.');
            return;
        }

        window.carritoAPI.agregarAlCarrito({
            id: mesaSeleccionada.id,
            nombre: mesaSeleccionada.nombre,
            precio: mesaSeleccionada.precio_base,
            cantidad: 1,
            opciones: { ...configuracion }
        });

        alert('Mesa configurada añadida al carrito');
    });
}
