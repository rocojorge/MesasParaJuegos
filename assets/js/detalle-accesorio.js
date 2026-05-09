const paramsAccesorio = new URLSearchParams(window.location.search);
const accesorioId = paramsAccesorio.get('id');

function mediaPath(src) {
    if (!src || src.startsWith('http') || src.startsWith('/') || src.startsWith('../')) return src;
    return `../${src}`;
}

fetch('../data/accesorios.json')
    .then(res => res.json())
    .then(data => {
        const acc = data.find(a => a.id === accesorioId) || data[0];

        document.getElementById('nombre-accesorio').textContent = acc.nombre;
        document.getElementById('descripcion-accesorio').textContent = acc.descripcion;
        document.getElementById('precio-accesorio').textContent = `${acc.precio} EUR`;
        document.getElementById('breadcrumb-nombre').textContent = acc.nombre;

        document.getElementById('imagen-accesorio').innerHTML = `
            <img
                src="${mediaPath(acc.imagen)}"
                alt="${acc.nombre}"
                onerror="this.parentElement.classList.add('sin-imagen'); this.remove();"
            >
        `;

        // ------------------------------
        // NUEVO: botón añadir al carrito
        // ------------------------------
        document.getElementById("btn-add-carrito").addEventListener("click", () => {
            window.carritoAPI.agregarAlCarrito({
                id: acc.id,
                nombre: acc.nombre,
                precio: acc.precio,
                cantidad: 1,
                opciones: {} // accesorios sin opciones
            });

            alert("Accesorio añadido al carrito");
        });
    });
