// Agregar funcionalidad a los botones de navegación
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', event => {
        // Mostrar contenido dinámico aquí
        console.log(`Se ha clickeado el botón ${button.textContent}`);
    });
});
