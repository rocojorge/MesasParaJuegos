// ------------------------------
// CARRITO (localStorage)
// ------------------------------
const CARRITO_KEY = 'carrito';
let carrito = [];

// Cargar carrito al inicio
try {
    const guardado = localStorage.getItem(CARRITO_KEY);
    carrito = guardado ? JSON.parse(guardado) : [];
} catch {
    carrito = [];
}

function guardarCarrito() {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

// Devuelve una copia para no mutar desde fuera
function obtenerCarrito() {
    return [...carrito];
}

// item esperado:
// {
//   id: "heracles-xl",
//   nombre: "Heracles XL",
//   precio: 1800,
//   cantidad: 1,
//   opciones: { material: "Roble", color: "Natural", ... }
// }
function agregarAlCarrito(item) {
    if (!item || !item.id) return;

    // Normalizamos opciones para comparar
    const opcionesStr = JSON.stringify(item.opciones || {});

    const existente = carrito.find(p =>
        p.id === item.id &&
        JSON.stringify(p.opciones || {}) === opcionesStr
    );

    if (existente) {
        existente.cantidad += item.cantidad || 1;
    } else {
        carrito.push({
            id: item.id,
            nombre: item.nombre || '',
            precio: item.precio || 0,
            cantidad: item.cantidad || 1,
            opciones: item.opciones || {}
        });
    }

    guardarCarrito();
}

// Cambiar cantidad de una línea concreta
function actualizarCantidad(index, nuevaCantidad) {
    if (index < 0 || index >= carrito.length) return;
    if (nuevaCantidad <= 0) {
        carrito.splice(index, 1);
    } else {
        carrito[index].cantidad = nuevaCantidad;
    }
    guardarCarrito();
}

// Eliminar una línea del carrito
function eliminarDelCarrito(index) {
    if (index < 0 || index >= carrito.length) return;
    carrito.splice(index, 1);
    guardarCarrito();
}

// Vaciar todo el carrito
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
}

// Calcular total
function totalCarrito() {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

// Exponer en window para usar desde otras páginas
window.carritoAPI = {
    obtenerCarrito,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalCarrito
};
