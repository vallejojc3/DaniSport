document.addEventListener('DOMContentLoaded', function() {
    const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');

    // Abrir la conexión con IndexedDB
    const request = window.indexedDB.open('clientesDB', 1);

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        // Iniciar una transacción de lectura
        const transaction = db.transaction(['clientes'], 'readonly');

        // Obtener el almacén de objetos
        const objectStore = transaction.objectStore('clientes');

        // Obtener todos los registros del almacén
        const requestGetAll = objectStore.getAll();

        requestGetAll.onsuccess = function(event) {
            const clientes = event.target.result;
            displayClientes(clientes);

            // Añadir evento de búsqueda
            searchInput.addEventListener('input', function() {
                const searchTerm = searchInput.value.toLowerCase();
                const rows = clientesTable.getElementsByTagName('tr');
                
                for (let i = 0; i < rows.length; i++) {
                    const cells = rows[i].getElementsByTagName('td');
                    let match = false;

                    for (let j = 0; j < cells.length; j++) {
                        if (cells[j].textContent.toLowerCase().includes(searchTerm)) {
                            match = true;
                            break;
                        }
                    }

                    if (match) {
                        rows[i].style.display = '';
                    } else {
                        rows[i].style.display = 'none';
                    }
                }
            });
        };

        requestGetAll.onerror = function(event) {
            console.error("Error al obtener los datos:", event.target.error);
        };
    };

    function displayClientes(clientes) {
        // Limpiar la tabla antes de mostrar los datos
        clientesTable.innerHTML = '';

        // Mostrar los datos en la tabla
        clientes.forEach(function(cliente) {
            const row = clientesTable.insertRow();
            const cellFecha = row.insertCell(0);
            const cellNumero = row.insertCell(1);
            const cellCliente = row.insertCell(2);
            const cellPrecio = row.insertCell(3);
            const cellPago = row.insertCell(4);
            const cellDebe = row.insertCell(5);

            cellFecha.textContent = cliente.fecha;
            cellNumero.textContent = cliente.numero;
            cellCliente.textContent = cliente.cliente;
            cellPrecio.textContent = cliente.precio.toFixed(2);
            cellPago.textContent = cliente.pago.toFixed(2);
            cellDebe.textContent = cliente.debe.toFixed(2);
        });
    }
});

