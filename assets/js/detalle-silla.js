const paramsSilla = new URLSearchParams(window.location.search);
const sillaId = paramsSilla.get('id');

function mediaPath(src) {
    if (!src || src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) return src;
    return `../${src}`;
}

fetch('../data/sillas.json')
    .then(res => res.json())
    .then(data => {
        const silla = data.find(s => s.id === sillaId) || data[0];

        document.getElementById('nombre-silla').textContent = silla.nombre;
        document.getElementById('descripcion-silla').textContent = silla.descripcion;
        document.getElementById('precio-silla').textContent = `${silla.precio} EUR`;
        document.getElementById('breadcrumb-nombre').textContent = silla.nombre;
        document.getElementById('imagen-silla').innerHTML = `
            <img
                src="${mediaPath(silla.imagen)}"
                alt="${silla.nombre}"
                onerror="this.parentElement.classList.add('sin-imagen'); this.remove();"
            >
        `;

        document.getElementById('caracteristicas-silla').innerHTML = silla.caracteristicas
            .map(c => `<li>${c}</li>`)
            .join('');
    });
