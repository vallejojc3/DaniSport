document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gastosForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const gasto = document.getElementById('gasto').value.trim();
        const detalle = document.getElementById('detalle').value.trim();
        const fecha = document.getElementById('fecha').value;

        if (gasto === '' || detalle === '' || fecha === '') {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Guardar en IndexedDB
        guardarGastoEnIndexedDB(gasto, detalle, fecha);

        // Limpiar el formulario
        form.reset();
    });
});

function guardarGastoEnIndexedDB(gasto, detalle, fecha) {
    // Abrir la conexión con la base de datos
    const request = window.indexedDB.open('almacenDB', 1);

    request.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        // Iniciar una transacción de lectura/escritura
        const transaction = db.transaction(['gastos'], 'readwrite');

        // Acceder al almacén de objetos
        const objectStore = transaction.objectStore('gastos');

        // Crear un objeto para guardar
        const nuevoGasto = {
            gasto: gasto,
            detalle: detalle,
            fecha: fecha
        };

        // Agregar el objeto a la base de datos
        const requestAdd = objectStore.add(nuevoGasto);

        requestAdd.onsuccess = function(event) {
            console.log('Gasto guardado en IndexedDB:', nuevoGasto);
        };

        requestAdd.onerror = function(event) {
            console.error('Error al guardar el gasto:', event.target.errorCode);
        };
    };

    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        // Crear un almacén de objetos para guardar los gastos
        db.createObjectStore('gastos', { keyPath: 'id', autoIncrement: true });
    };
}
