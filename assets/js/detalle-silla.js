const paramsSilla = new URLSearchParams(window.location.search);
const sillaId = paramsSilla.get('id');

fetch('../data/sillas.json')
    .then(res => res.json())
    .then(data => {
        const silla = data.find(s => s.id === sillaId) || data[0];

        document.getElementById('nombre-silla').textContent = silla.nombre;
        document.getElementById('descripcion-silla').textContent = silla.descripcion;
        document.getElementById('precio-silla').textContent = `${silla.precio} €`;
        document.getElementById('breadcrumb-nombre').textContent = silla.nombre;
        document.getElementById('imagen-silla').setAttribute('aria-label', silla.nombre);

        document.getElementById('caracteristicas-silla').innerHTML = silla.caracteristicas
            .map(c => `<li>${c}</li>`)
            .join('');
    });
