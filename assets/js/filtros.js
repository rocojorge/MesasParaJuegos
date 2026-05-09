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
        renderProductos(productos);
    })
    .catch(() => {
        document.getElementById('grid-productos').innerHTML = '<p>No se ha podido cargar el catálogo.</p>';
    });

function renderProductos(lista) {
    const contenedor = document.getElementById('grid-productos');
    if (!contenedor) return;

    if (!lista.length) {
        contenedor.innerHTML = '<p>No hay mesas que coincidan con esos filtros.</p>';
        return;
    }

    contenedor.innerHTML = lista.map(p => `
        <article class="card-producto">
            <img src="${mediaPath(p.imagen)}" alt="${p.nombre}" loading="lazy" onerror="this.closest('.card-producto').classList.add('sin-imagen'); this.remove();">
            <div class="contenido">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <p><strong>Desde ${p.precio_base} €</strong></p>
                <a href="${catalogRoot}pages/detalle.html?id=${p.id}">Ver detalles</a>
            </div>
        </article>
    `).join('');
}

document.getElementById('btn-filtrar')?.addEventListener('click', () => {
    const tipo = document.getElementById('filtro-tipo').value;
    const tamano = document.getElementById('filtro-tamano').value;
    const precioMax = Number(document.getElementById('filtro-precio').value);

    const filtrados = productos.filter(p => {
        const coincideTipo = tipo === 'todos' || p.tipo.includes(tipo);
        const coincideTamano = tamano === 'todos' || p.tamanos.includes(tamano);
        const coincidePrecio = p.precio_base <= precioMax;
        return coincideTipo && coincideTamano && coincidePrecio;
    });

    renderProductos(filtrados);
});

document.getElementById('filtro-precio')?.addEventListener('input', e => {
    document.getElementById('precio-max').textContent = `${e.target.value} €`;
});
