const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch('data/sillas.json')
    .then(res => res.json())
    .then(data => {
        const silla = data.find(s => s.id === id);

        document.getElementById('nombre-silla').textContent = silla.nombre;
        document.getElementById('descripcion-silla').textContent = silla.descripcion;
        document.getElementById('precio-silla').textContent = silla.precio + " €";
        document.getElementById('breadcrumb-nombre').textContent = silla.nombre;

        const lista = document.getElementById('caracteristicas-silla');
        silla.caracteristicas.forEach(c => {
            lista.innerHTML += `<li>${c}</li>`;
        });

        document.getElementById('imagen-silla').innerHTML = `<div class="img-placeholder grande"></div>`;
    });
