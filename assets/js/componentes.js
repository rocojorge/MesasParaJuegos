const rootPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

const links = [
    { href: 'index.html', label: 'Inicio' },
    { href: 'catalogo.html', label: 'Mesas' },
    { href: 'pages/accesorios.html', label: 'Accesorios' },
    { href: 'pages/sillas.html', label: 'Sillas' },
    { href: 'pages/guia-tamanos.html', label: 'Entrega inmediata' },
    { href: 'pages/contacto.html', label: 'Contacto' }
];

function pathTo(href) {
    return `${rootPrefix}${href}`;
}

function mediaPath(src) {
    if (!src || src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) return src;
    return pathTo(src);
}

function renderHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const current = window.location.pathname.split('/').pop() || 'index.html';
    const nav = links.map(link => {
        const isActive = link.href.endsWith(current);
        return `<li><a class="${isActive ? 'activo' : ''}" href="${pathTo(link.href)}">${link.label}</a></li>`;
    }).join('');

    header.innerHTML = `
        <div class="site-header">
            <div class="nav-wrap">
                <a class="brand" href="${pathTo('index.html')}">
                    <span class="brand-logo">Mesas<br>Para Juegos</span>
                </a>

                <nav class="site-nav" aria-label="Navegación principal">
                    <ul>${nav}</ul>
                </nav>

                <div class="nav-actions">
                    <a aria-label="Buscar" href="${pathTo('catalogo.html')}">⌕</a>

                    <!-- NUEVO: icono carrito -->
                    <a aria-label="Carrito" href="${pathTo('pages/carrito.html')}" class="carrito-icon">
                        🛒 <span id="carrito-count">0</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    // ------------------------------
    // NUEVO: actualizar contador del carrito
    // ------------------------------
    function actualizarCarritoHeader() {
        if (!window.carritoAPI) return;

        const count = window.carritoAPI
            .obtenerCarrito()
            .reduce((acc, item) => acc + item.cantidad, 0);

        const span = document.getElementById("carrito-count");
        if (span) span.textContent = count;
    }

    // Actualizar al cargar
    setTimeout(actualizarCarritoHeader, 50);

    // Actualizar si cambia el localStorage
    window.addEventListener("storage", actualizarCarritoHeader);
}


function renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;

    footer.innerHTML = `
        <div class="footer-grid">
            <div>
                <h3>Mesas Para Juegos</h3>
                <p>Fabricación artesanal de mesas, accesorios y mobiliario para juegos de mesa.</p>
            </div>
            <div>
                <h4>Contacto</h4>
                <p>607 85 80 40</p>
                <p>mesasparajuegos@gmail.com</p>
                <p>Lucena, Córdoba</p>
            </div>
            <div>
                <h4>Enlaces</h4>
                <p><a href="${pathTo('catalogo.html')}">Mesas</a></p>
                <p><a href="${pathTo('pages/accesorios.html')}">Accesorios</a></p>
                <p><a href="${pathTo('pages/contacto.html')}">Solicitar presupuesto</a></p>
            </div>
        </div>
    `;
}

function renderProductoCard(producto) {
    return `
        <article class="card-producto">
            <a href="${pathTo(`pages/detalle.html?id=${producto.id}`)}">
                <img src="${mediaPath(producto.imagen)}" alt="${producto.nombre}" loading="lazy" onerror="this.closest('.card-producto').classList.add('sin-imagen'); this.remove();">
            </a>
            <div class="contenido">
                <h3><a href="${pathTo(`pages/detalle.html?id=${producto.id}`)}">${producto.nombre}</a></h3>
                <p>${producto.descripcion}</p>
                <p><strong>Desde ${producto.precio_base} €</strong></p>
                <a href="${pathTo(`pages/detalle.html?id=${producto.id}`)}">Ver detalles</a>
            </div>
        </article>
    `;
}

function renderDestacados() {
    const contenedor = document.getElementById('productos-destacados');
    if (!contenedor) return;

    fetch(pathTo('data/productos.json'))
        .then(res => res.json())
        .then(data => {
            contenedor.innerHTML = data.slice(0, 4).map(renderProductoCard).join('');
        })
        .catch(() => {
            contenedor.innerHTML = '<p>No se ha podido cargar el catálogo destacado.</p>';
        });
}

renderHeader();
renderFooter();
renderDestacados();
