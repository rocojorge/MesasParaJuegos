const catalogRoot = window.location.pathname.includes('/pages/') ? '../' : '';
let productos = [];

function mediaPath(src) {
    if (!src || src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) return src;
    return `${catalogRoot}${src}`;
}

fetch(`${catalogRoot}data/productos.json`)
    .then(res => res.json())
    .then(data => {
        productos = data;
        aplicarFiltros();
    })
    .catch(() => {
        document.getElementById('grid-productos').innerHTML = '<p>No se ha podido cargar el catálogo.</p>';
    });

function normalizarTexto(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function campoBuscable(producto) {
    return normalizarTexto([
        producto.nombre,
        producto.descripcion,
        producto.tipo,
        producto.tamanos,
        producto.precio_base,
        producto.accesorios,
        producto.materiales,
        producto.colores,
        producto.tapetes,
        producto.cajon,
        producto.lamina,
        producto.leds,
        producto.cierre
    ].flat(Infinity).join(' '));
}

function renderProductos(lista) {
    const contenedor = document.getElementById('grid-productos');
    if (!contenedor) return;

    if (!lista.length) {
        contenedor.innerHTML = '<p>No hay mesas que coincidan con esos filtros.</p>';
        return;
    }

    contenedor.innerHTML = lista.map(p => `
        <article class="card-producto">
            <a href="${catalogRoot}pages/detalle.html?id=${p.id}">
                <img src="${mediaPath(p.imagen)}" alt="${p.nombre}" loading="lazy" decoding="async" width="900" height="600" onerror="this.closest('.card-producto').classList.add('sin-imagen'); this.remove();">
            </a>
            <div class="contenido">
                <h3><a href="${catalogRoot}pages/detalle.html?id=${p.id}">${p.nombre}</a></h3>
                <p>${p.descripcion}</p>
                <p><strong>Desde ${p.precio_base} €</strong></p>
                <a href="${catalogRoot}pages/detalle.html?id=${p.id}">Ver detalles</a>
            </div>
        </article>
    `).join('');
}

function aplicarFiltros() {
    const busqueda = normalizarTexto(document.getElementById('busqueda-productos')?.value);
    const tipo = document.getElementById('filtro-tipo')?.value || 'todos';
    const tamano = document.getElementById('filtro-tamano')?.value || 'todos';
    const precioMax = Number(document.getElementById('filtro-precio')?.value || 3000);

    const filtrados = productos.filter(p => {
        const tipos = Array.isArray(p.tipo) ? p.tipo : [p.tipo];
        const coincideBusqueda = !busqueda || campoBuscable(p).includes(busqueda);
        const coincideTipo = tipo === 'todos' || tipos.includes(tipo);
        const coincideTamano = tamano === 'todos' || p.tamanos.includes(tamano);
        const coincidePrecio = p.precio_base <= precioMax;
        return coincideBusqueda && coincideTipo && coincideTamano && coincidePrecio;
    });

    renderProductos(filtrados);
}

document.getElementById('btn-filtrar')?.addEventListener('click', aplicarFiltros);
document.getElementById('busqueda-productos')?.addEventListener('input', aplicarFiltros);
document.getElementById('filtro-tipo')?.addEventListener('change', aplicarFiltros);
document.getElementById('filtro-tamano')?.addEventListener('change', aplicarFiltros);

document.getElementById('filtro-precio')?.addEventListener('input', e => {
    document.getElementById('precio-max').textContent = `${e.target.value} €`;
    aplicarFiltros();
});
