// Cargar productos y renderizar catálogo
let productos = [];

fetch('data/productos.json')
    .then(res => res.json())
    .then(data => {
        productos = data;
        renderProductos(productos);
    });

// Renderizar tarjetas de producto
function renderProductos(lista) {
    const contenedor = document.getElementById('grid-productos');
    contenedor.innerHTML = "";

    lista.forEach(p => {
        contenedor.innerHTML += `
            <div class="card-producto">
                <div class="img-placeholder"></div>
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <p><strong>Desde ${p.precio_base} €</strong></p>
                <a href="pages/detalle.html?id=${p.id}">Ver detalles</a>
            </div>
        `;
    });
}

// FILTROS
document.getElementById('btn-filtrar').addEventListener('click', () => {
    const tipo = document.getElementById('filtro-tipo').value;
    const tamano = document.getElementById('filtro-tamano').value;
    const precioMax = document.getElementById('filtro-precio').value;

    const filtrados = productos.filter(p => {
        const coincideTipo = tipo === "todos" || p.tipo === tipo;
        const coincideTamano = tamano === "todos" || p.tamanos.includes(tamano);
        const coincidePrecio = p.precio_base <= precioMax;

        return coincideTipo && coincideTamano && coincidePrecio;
    });

    renderProductos(filtrados);
});

// Actualizar texto del precio
document.getElementById('filtro-precio').addEventListener('input', e => {
    document.getElementById('precio-max').textContent = e.target.value + " €";
});
