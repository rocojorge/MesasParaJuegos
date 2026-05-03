fetch('/data/sillas.json')
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('grid-sillas');
        data.forEach(s => {
            contenedor.innerHTML += `
                <div class="card-producto">
                    <div class="img-placeholder"></div>
                    <h3>${s.nombre}</h3>
                    <p>${s.descripcion}</p>
                    <p><strong>${s.precio} €</strong></p>
                    <a href="/pages/detalle-silla.html?id=${s.id}">Ver detalles</a>
                </div>
            `;
        });
    });
