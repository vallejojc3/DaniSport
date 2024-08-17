document.getElementById('categoryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const category = document.getElementById('categoria').value;

    // Redirigir a la página correspondiente según la opción seleccionada
    window.location.href = category + '.html';
});
