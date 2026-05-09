const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../data/sillas.json")
    .then(res => res.json())
    .then(data => {
        const silla = data.find(s => s.id === id);
        if (!silla) return;

        // Rellenar datos
        document.getElementById("breadcrumb-nombre").textContent = silla.nombre;
        document.getElementById("nombre-silla").textContent = silla.nombre;
        document.getElementById("descripcion-silla").textContent = silla.descripcion;
        document.getElementById("precio-silla").textContent = `${silla.precio} EUR`;

        // Imagen
        document.getElementById("imagen-silla").innerHTML = `
            <img src="../${silla.imagen}" alt="${silla.nombre}">
        `;

        // Características
        const lista = document.getElementById("caracteristicas-silla");
        lista.innerHTML = silla.caracteristicas
            .map(c => `<li>${c}</li>`)
            .join("");

        // Activar botón carrito
        document.getElementById("btn-add-carrito").addEventListener("click", () => {
            window.carritoAPI.agregarAlCarrito({
                id: silla.id,
                nombre: silla.nombre,
                precio: silla.precio,
                cantidad: 1,
                opciones: {} // sin opciones en sillas
            });

            alert("Silla añadida al carrito");
        });
    });
