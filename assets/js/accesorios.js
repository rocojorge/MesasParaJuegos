function mediaPath(src) {
    if (!src || src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) return src;
    return `../${src}`;
}

fetch('../data/accesorios.json')
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('grid-accesorios');
        contenedor.innerHTML = data.map(a => `
            <article class="card-producto">
                <img src="${mediaPath(a.imagen)}" alt="${a.nombre}" loading="lazy"
                     onerror="this.closest('.card-producto').classList.add('sin-imagen'); this.remove();">

                <div class="contenido">
                    <h3><a href="detalle-accesorio.html?id=${a.id}">${a.nombre}</a></h3>
                    <p>${a.descripcion}</p>
                    <p><strong>${a.precio} EUR</strong></p>

                    <a href="detalle-accesorio.html?id=${a.id}">Ver detalles</a>

                    <!-- NUEVO: botón carrito -->
                    <button class="btn-primary btn-add-carrito"
                            data-id="${a.id}"
                            data-nombre="${a.nombre}"
                            data-precio="${a.precio}"
                            data-imagen="${a.imagen}">
                        Añadir al carrito
                    </button>
                </div>
            </article>
        `).join('');
    })
    .catch(() => {
        document.getElementById('grid-accesorios').innerHTML = '<p>No se han podido cargar los accesorios.</p>';
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
            opciones: { tipo: "accesorio" },
            imagen: btn.dataset.imagen
        });

        alert("Accesorio añadido al carrito");
    }
});
