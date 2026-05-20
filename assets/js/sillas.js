function mediaPath(src) {
    if (!src || src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) return src;
    return `../${src}`;
}

fetch('../data/sillas.json')
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('grid-sillas');
        contenedor.innerHTML = data.map(s => `
            <article class="card-producto">
                <a href="detalle-silla.html?id=${s.id}">
                    <img src="${mediaPath(s.imagen)}" alt="${s.nombre}" loading="lazy"
                         decoding="async" width="900" height="600"
                         onerror="this.closest('.card-producto').classList.add('sin-imagen'); this.remove();">
                </a>

                <div class="contenido">
                    <h3><a href="detalle-silla.html?id=${s.id}">${s.nombre}</a></h3>
                    <p>${s.descripcion}</p>
                    <p><strong>${s.precio} EUR</strong></p>

                    <a href="detalle-silla.html?id=${s.id}">Ver detalles</a>

                    <!-- NUEVO: botón carrito -->
                    <button class="btn-primary btn-add-carrito"
                            data-id="${s.id}"
                            data-nombre="${s.nombre}"
                            data-precio="${s.precio}"
                            data-imagen="${s.imagen}">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `).join('');
    })
    .catch(() => {
        document.getElementById('grid-sillas').innerHTML = '<p>No se han podido cargar las sillas.</p>';
    });


// ------------------------------
// NUEVO: Listener global para carrito
// ------------------------------
document.addEventListener("click", e => {
    if (e.target.classList.contains("btn-add-carrito")) {
        const btn = e.target;

        window.carritoAPI.agregarAlCarrito({
            id: btn.dataset.id,
            nombre: btn.dataset.nombre,
            precio: Number(btn.dataset.precio),
            cantidad: 1,
            opciones: {}
        });
    }
});
