const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch('/data/accesorios.json')
    .then(res => res.json())
    .then(data => {
        const acc = data.find(a => a.id === id);

        document.getElementById('nombre-accesorio').textContent = acc.nombre;
        document.getElementById('descripcion-accesorio').textContent = acc.descripcion;
        document.getElementById('precio-accesorio').textContent = acc.precio + " €";
        document.getElementById('breadcrumb-nombre').textContent = acc.nombre;

        document.getElementById('imagen-accesorio').innerHTML = `<div class="img-placeholder grande"></div>`;
    });
