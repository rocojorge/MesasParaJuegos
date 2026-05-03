// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Cargar datos
Promise.all([
    fetch('../../data/productos.json').then(r => r.json()),
    fetch('../../data/accesorios.json').then(r => r.json()),
    fetch('../../data/medidas.json').then(r => r.json())
]).then(([productos, accesorios, medidas]) => {

    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    // Rellenar datos principales
    document.getElementById('nombre-producto').textContent = producto.nombre;
    document.getElementById('descripcion-producto').textContent = producto.descripcion;
    document.getElementById('breadcrumb-nombre').textContent = producto.nombre;

    // Imagen principal
    document.getElementById('imagen-producto').innerHTML = `<div class="img-placeholder grande"></div>`;

    // Accesorios compatibles
    const listaAcc = document.getElementById('lista-accesorios');
    producto.accesorios.forEach(a => {
        const acc = accesorios.find(x => x.id === a);
        listaAcc.innerHTML += `<li>${acc.nombre}</li>`;
    });

    // Tabla de medidas
    const tablaMedidas = document.getElementById('tabla-medidas');
    tablaMedidas.innerHTML = `
        <tr><th>Tamaño</th><th>Largo</th><th>Ancho</th><th>Alto</th></tr>
    `;
    medidas[id].forEach(m => {
        tablaMedidas.innerHTML += `
            <tr>
                <td>${m.tamano}</td>
                <td>${m.largo} cm</td>
                <td>${m.ancho} cm</td>
                <td>${m.alto} cm</td>
            </tr>
        `;
    });

    // Tabla de precios
    const tablaPrecios = document.getElementById('tabla-precios');
    tablaPrecios.innerHTML = `
        <tr><th>Tamaño</th><th>Precio</th></tr>
    `;
    producto.precios.forEach(p => {
        tablaPrecios.innerHTML += `
            <tr>
                <td>${p.tamano}</td>
                <td>${p.precio} €</td>
            </tr>
        `;
    });

    // Galería
    const galeria = document.getElementById('galeria-grid');
    for (let i = 0; i < 5; i++) {
        galeria.innerHTML += `<div class="img-placeholder"></div>`;
    }
});
