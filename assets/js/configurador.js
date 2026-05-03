// Pasos del configurador
const pasos = ["Material", "Color", "Tapete", "Cajón", "Lámina", "LEDs", "Cierre Magnético"];
let pasoActual = 0;

// Opciones simuladas
const opciones = {
    Material: ["Roble", "Nogal", "Pino"],
    Color: ["Natural", "Oscuro", "Blanco"],
    Tapete: ["Rojo", "Azul", "Verde"],
    Cajón: ["Sí", "No"],
    Lámina: ["Transparente", "Opaca"],
    LEDs: ["Sí", "No"],
    "Cierre Magnético": ["Sí", "No"]
};

// Renderizar paso actual
function renderPaso() {
    document.getElementById("titulo-paso").textContent = pasos[pasoActual];

    const contenedor = document.getElementById("opciones");
    contenedor.innerHTML = "";

    opciones[pasos[pasoActual]].forEach(op => {
        contenedor.innerHTML += `
            <label class="opcion">
                <input type="radio" name="opcion" value="${op}">
                ${op}
            </label>
        `;
    });

    // Actualizar barra de pasos
    document.querySelectorAll(".paso").forEach((p, i) => {
        p.classList.toggle("activo", i === pasoActual);
    });
}

renderPaso();

// Botón siguiente
document.getElementById("btn-siguiente").addEventListener("click", () => {
    const seleccion = document.querySelector("input[name='opcion']:checked");

    if (!seleccion) {
        alert("Selecciona una opción para continuar");
        return;
    }

    if (pasoActual < pasos.length - 1) {
        pasoActual++;
        renderPaso();
    } else {
        mostrarResumen();
    }
});

// Resumen final
function mostrarResumen() {
    document.querySelector(".config-layout").innerHTML = `
        <h2>Resumen de tu configuración</h2>
        <p>Tu mesa ha sido configurada correctamente.</p>
        <a class="btn-primary" href="/pages/contacto.html">Solicitar presupuesto</a>
    `;
}
