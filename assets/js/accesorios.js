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
                <img src="${mediaPath(a.imagen)}" alt="${a.nombre}" loading="lazy" onerror="this.closest('.card-producto').classList.add('sin-imagen'); this.remove();">
                <div class="contenido">
                    <h3>${a.nombre}</h3>
                    <p>${a.descripcion}</p>
                    <p><strong>${a.precio} EUR</strong></p>
                    <a href="detalle-accesorio.html?id=${a.id}">Ver detalles</a>
                </div>
            </article>
        `).join('');
    })
    .catch(() => {
        document.getElementById('grid-accesorios').innerHTML = '<p>No se han podido cargar los accesorios.</p>';
    });
