fetch('data/accesorios.json')
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('grid-accesorios');
        data.forEach(a => {
            contenedor.innerHTML += `
                <div class="card-producto">
                    <div class="img-placeholder"></div>
                    <h3>${a.nombre}</h3>
                    <p>${a.descripcion}</p>
                    <p><strong>${a.precio} €</strong></p>
                    <a href="pages/detalle-accesorio.html?id=${a.id}">Ver detalles</a>
                </div>
            `;
        });
    });
