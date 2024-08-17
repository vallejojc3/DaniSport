document.addEventListener('DOMContentLoaded', function() {
    const clientesForm = document.getElementById('clientesForm');

    clientesForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const numero = document.getElementById('numero').value;
        const cliente = document.getElementById('cliente').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const pago = parseFloat(document.getElementById('pago').value);
        const fecha = document.getElementById('fecha').value;
        const debe = precio - pago;

        // Guardar datos en IndexedDB
        guardarDatosIndexedDB(numero, cliente, precio, pago, fecha, debe);

        // Limpiar el formulario después de guardar
        clientesForm.reset();
    });
});

function guardarDatosIndexedDB(numero, cliente, precio, pago, fecha, debe) {
    // Abrir la conexión con IndexedDB
    const request = window.indexedDB.open('clientesDB', 1);

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        // Crear un almacén de objetos (object store) si no existe
        const objectStore = db.createObjectStore('clientes', { keyPath: 'id', autoIncrement: true });

        // Definir los índices
        objectStore.createIndex('numero', 'numero', { unique: false });
        objectStore.createIndex('cliente', 'cliente', { unique: false });
        objectStore.createIndex('precio', 'precio', { unique: false });
        objectStore.createIndex('pago', 'pago', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('debe', 'debe', { unique: false });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        // Iniciar una transacción de escritura
        const transaction = db.transaction(['clientes'], 'readwrite');

        // Obtener el almacén de objetos
        const objectStore = transaction.objectStore('clientes');

        // Agregar un registro con los datos del cliente
        const clienteData = {
            numero: numero,
            cliente: cliente,
            precio: precio,
            pago: pago,
            fecha: fecha,
            debe: debe
        };

        const requestAdd = objectStore.add(clienteData);

        requestAdd.onsuccess = function(event) {
            console.log("Datos guardados exitosamente en IndexedDB.");
        };

        transaction.oncomplete = function() {
            db.close();
        };

        transaction.onerror = function(event) {
            console.error("Error al guardar los datos:", event.target.error);
        };
    };
}
