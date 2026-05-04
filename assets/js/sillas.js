fetch('../data/sillas.json')
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('grid-sillas');
        contenedor.innerHTML = data.map(s => `
            <article class="card-producto">
                <div class="img-placeholder" aria-hidden="true"></div>
                <div class="contenido">
                    <h3>${s.nombre}</h3>
                    <p>${s.descripcion}</p>
                    <p><strong>${s.precio} €</strong></p>
                    <a href="detalle-silla.html?id=${s.id}">Ver detalles</a>
                </div>
            </article>
        `).join('');
    })
    .catch(() => {
        document.getElementById('grid-sillas').innerHTML = '<p>No se han podido cargar las sillas.</p>';
    });
