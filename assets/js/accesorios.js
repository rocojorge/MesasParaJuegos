fetch('../data/accesorios.json')
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('grid-accesorios');
        contenedor.innerHTML = data.map(a => `
            <article class="card-producto">
                <div class="img-placeholder" aria-hidden="true"></div>
                <div class="contenido">
                    <h3>${a.nombre}</h3>
                    <p>${a.descripcion}</p>
                    <p><strong>${a.precio} €</strong></p>
                    <a href="detalle-accesorio.html?id=${a.id}">Ver detalles</a>
                </div>
            </article>
        `).join('');
    })
    .catch(() => {
        document.getElementById('grid-accesorios').innerHTML = '<p>No se han podido cargar los accesorios.</p>';
    });
