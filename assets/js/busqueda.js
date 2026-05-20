const dataSources = [
    {
        tipo: 'mesa',
        etiqueta: 'Mesa',
        url: '../data/productos.json',
        detalle: item => `detalle.html?id=${item.id}`,
        precio: item => `Desde ${item.precio_base} €`
    },
    {
        tipo: 'accesorio',
        etiqueta: 'Accesorio',
        url: '../data/accesorios.json',
        detalle: item => `detalle-accesorio.html?id=${item.id}`,
        precio: item => `${item.precio} €`
    },
    {
        tipo: 'silla',
        etiqueta: 'Silla',
        url: '../data/sillas.json',
        detalle: item => `detalle-silla.html?id=${item.id}`,
        precio: item => `${item.precio} €`
    }
];

let indiceBusqueda = [];
let tipoActivo = 'todos';

const inputBusqueda = document.getElementById('busqueda-global');
const formBusqueda = document.getElementById('form-busqueda');
const gridBusqueda = document.getElementById('grid-busqueda');
const metaBusqueda = document.getElementById('resultado-meta');
const botonesTipo = document.querySelectorAll('.busqueda-tabs button');

function normalizarTexto(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function textoBuscable(item, source) {
    return normalizarTexto([
        source.etiqueta,
        item.nombre,
        item.descripcion,
        item.tipo,
        item.tamanos,
        item.precio,
        item.precio_base,
        item.caracteristicas,
        item.accesorios,
        item.materiales,
        item.colores,
        item.tapetes,
        item.cajon,
        item.lamina,
        item.leds,
        item.cierre
    ].flat(Infinity).join(' '));
}

function mediaPath(src) {
    if (!src || src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) return src;
    return `../${src}`;
}

function crearResultado(item) {
    return `
        <article class="card-producto resultado-card">
            <a href="${item.href}">
                <img src="${mediaPath(item.imagen)}" alt="${item.nombre}" loading="lazy"
                     decoding="async" width="900" height="600"
                     onerror="this.closest('.card-producto').classList.add('sin-imagen'); this.remove();">
            </a>
            <div class="contenido">
                <span class="resultado-tipo">${item.etiqueta}</span>
                <h3><a href="${item.href}">${item.nombre}</a></h3>
                <p>${item.descripcion}</p>
                <p><strong>${item.precioTexto}</strong></p>
                <a href="${item.href}">Ver detalles</a>
            </div>
        </article>
    `;
}

function actualizarURL(termino) {
    const params = new URLSearchParams(window.location.search);

    if (termino) {
        params.set('q', termino);
    } else {
        params.delete('q');
    }

    const query = params.toString();
    const nuevaURL = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({}, '', nuevaURL);
}

function aplicarBusqueda() {
    const termino = normalizarTexto(inputBusqueda.value);
    const textoOriginal = inputBusqueda.value.trim();

    const resultados = indiceBusqueda.filter(item => {
        const coincideTexto = !termino || item.search.includes(termino);
        const coincideTipo = tipoActivo === 'todos' || item.tipo === tipoActivo;
        return coincideTexto && coincideTipo;
    });

    gridBusqueda.innerHTML = resultados.map(crearResultado).join('');

    if (!resultados.length) {
        gridBusqueda.innerHTML = `
            <div class="sin-resultados">
                <h2>No hay resultados</h2>
                <p>Prueba con otro nombre, material, tamaño o accesorio.</p>
            </div>
        `;
    }

    const botonActivo = [...botonesTipo].find(boton => boton.dataset.tipo === tipoActivo);
    const etiquetaTipo = tipoActivo === 'todos' ? 'el catálogo' : (botonActivo?.textContent || tipoActivo);

    metaBusqueda.textContent = textoOriginal
        ? `${resultados.length} resultado(s) para "${textoOriginal}"`
        : `${resultados.length} elemento(s) disponibles en ${etiquetaTipo}`;

    actualizarURL(textoOriginal);
}

function activarTipo(tipo) {
    tipoActivo = tipo;
    botonesTipo.forEach(boton => {
        boton.classList.toggle('activo', boton.dataset.tipo === tipo);
    });
    aplicarBusqueda();
}

Promise.all(dataSources.map(source =>
    fetch(source.url)
        .then(res => res.json())
        .then(items => items.map(item => ({
            ...item,
            tipo: source.tipo,
            etiqueta: source.etiqueta,
            href: source.detalle(item),
            precioTexto: source.precio(item),
            search: textoBuscable(item, source)
        })))
))
    .then(grupos => {
        indiceBusqueda = grupos.flat();
        inputBusqueda.value = new URLSearchParams(window.location.search).get('q') || '';
        aplicarBusqueda();
        inputBusqueda.focus();
    })
    .catch(() => {
        metaBusqueda.textContent = 'No se ha podido cargar la búsqueda.';
        gridBusqueda.innerHTML = '';
    });

formBusqueda.addEventListener('submit', event => {
    event.preventDefault();
    aplicarBusqueda();
});

inputBusqueda.addEventListener('input', aplicarBusqueda);

botonesTipo.forEach(boton => {
    boton.addEventListener('click', () => activarTipo(boton.dataset.tipo));
});
