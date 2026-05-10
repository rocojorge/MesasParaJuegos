const detalleRoot = '../';
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

function mediaPath(src) {
    if (!src || src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) return src;
    return `${detalleRoot}${src}`;
}

Promise.all([
    fetch(`${detalleRoot}data/productos.json`).then(r => r.json()),
    fetch(`${detalleRoot}data/accesorios.json`).then(r => r.json()),
    fetch(`${detalleRoot}data/medidas.json`).then(r => r.json())
]).then(([productos, accesorios, medidas]) => {

    const producto = productos.find(p => p.id === id) || productos[0];
    if (!producto) return;

    // ------------------------------
    // Rellenar datos del producto
    // ------------------------------
    document.getElementById('nombre-producto').textContent = producto.nombre;
    document.getElementById('descripcion-producto').textContent = producto.descripcion;
    document.getElementById('breadcrumb-nombre').textContent = producto.nombre;

    document.getElementById('imagen-producto').innerHTML = `
        <img src="${mediaPath(producto.imagen)}" alt="${producto.nombre}"
             onerror="this.parentElement.classList.add('sin-imagen'); this.remove();">
    `;

    document.getElementById("btn-configurar").href = `configurador.html?id=${producto.id}`;

    // ------------------------------
    // Accesorios compatibles
    // ------------------------------
    const listaAcc = document.getElementById('lista-accesorios');
    listaAcc.innerHTML = producto.accesorios.map(a => {
        const acc = accesorios.find(x => x.id === a);
        return acc ? `<li>${acc.nombre}</li>` : '';
    }).join('');

    // ------------------------------
    // Tabla de medidas
    // ------------------------------
    const tablaMedidas = document.getElementById('tabla-medidas');
    tablaMedidas.innerHTML = '<tr><th>Tamaño</th><th>Largo</th><th>Ancho</th><th>Alto</th></tr>';

    (medidas[producto.id] || []).forEach(m => {
        tablaMedidas.innerHTML += `
            <tr>
                <td>${m.tamano}</td>
                <td>${m.largo} cm</td>
                <td>${m.ancho} cm</td>
                <td>${m.alto} cm</td>
            </tr>
        `;
    });

    // ------------------------------
    // Tabla de precios
    // ------------------------------
    const tablaPrecios = document.getElementById('tabla-precios');
    tablaPrecios.innerHTML = '<tr><th>Tamaño</th><th>Precio</th></tr>';

    producto.precios.forEach(p => {
        tablaPrecios.innerHTML += `
            <tr>
                <td>${p.tamano}</td>
                <td>${p.precio} €</td>
            </tr>
        `;
    });

    // ------------------------------
    // Galería (placeholders)
    // ------------------------------
    const galeria = document.getElementById('galeria-grid');
    galeria.innerHTML = Array.from({ length: 5 }, () =>
        '<div class="img-placeholder" aria-hidden="true"></div>'
    ).join('');

    // ------------------------------
    // BOTÓN: Agregar al carrito
    // ------------------------------
    const btnCarrito = document.getElementById("btn-carrito");

    if (btnCarrito) {
        btnCarrito.addEventListener("click", () => {
            window.carritoAPI.agregarAlCarrito({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio_base,
                cantidad: 1,
                opciones: {}
            });

            alert("Producto añadido al carrito");
        });
    }

}).catch(() => {
    document.querySelector('main').innerHTML = `
        <section class="titulo-pagina">
            <h1>No se ha podido cargar el producto</h1>
            <p>Vuelve al catálogo para intentarlo de nuevo.</p>
        </section>
    `;
});
