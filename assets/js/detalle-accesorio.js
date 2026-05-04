const paramsAccesorio = new URLSearchParams(window.location.search);
const accesorioId = paramsAccesorio.get('id');

fetch('../data/accesorios.json')
    .then(res => res.json())
    .then(data => {
        const acc = data.find(a => a.id === accesorioId) || data[0];

        document.getElementById('nombre-accesorio').textContent = acc.nombre;
        document.getElementById('descripcion-accesorio').textContent = acc.descripcion;
        document.getElementById('precio-accesorio').textContent = `${acc.precio} €`;
        document.getElementById('breadcrumb-nombre').textContent = acc.nombre;
        document.getElementById('imagen-accesorio').setAttribute('aria-label', acc.nombre);
    });
