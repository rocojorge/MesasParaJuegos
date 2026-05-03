// Cargar HEADER
fetch('../components/header.html')
    .then(res => res.text())
    .then(html => document.getElementById('header').innerHTML = html);

// Cargar FOOTER
fetch('../components/footer.html')
    .then(res => res.text())
    .then(html => document.getElementById('footer').innerHTML = html);

// Cargar productos destacados
fetch('../data/productos.json')
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('productos-destacados');
        data.slice(0, 3).forEach(producto => {
            contenedor.innerHTML += `
                <div class="card-producto">
                    <div class="img-placeholder"></div>
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <a href="pages/detalle.html?id=${producto.id}">Ver detalles</a>
                </div>
            `;
        });
    });
