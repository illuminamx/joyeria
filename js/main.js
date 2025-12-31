// Quitar el foco al cerrar modales para evitar errores de consola
document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('hidden.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
});

// Inicializar el carrito vacío visualmente al cargar
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});