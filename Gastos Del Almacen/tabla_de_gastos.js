document.addEventListener('DOMContentLoaded', function() {
    mostrarGastosDesdeIndexedDB();
});

function mostrarGastosDesdeIndexedDB() {
    const request = window.indexedDB.open('almacenDB', 1);

    request.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        const transaction = db.transaction(['gastos'], 'readonly');
        const objectStore = transaction.objectStore('gastos');
        const requestGetAll = objectStore.getAll();

        requestGetAll.onsuccess = function(event) {
            const gastos = event.target.result;

            const tableBody = document.querySelector('#gastosTable tbody');
            const totalesPorMes = {};

            gastos.forEach(function(gasto) {
                const fecha = new Date(gasto.fecha);
                const mesAnio = `${fecha.getMonth() + 1}-${fecha.getFullYear()}`;

                if (!totalesPorMes[mesAnio]) {
                    totalesPorMes[mesAnio] = 0;
                }
                totalesPorMes[mesAnio] += parseFloat(gasto.gasto);

                const row = tableBody.insertRow();
                const cellFecha = row.insertCell(0);
                const cellGasto = row.insertCell(1);
                const cellDetalle = row.insertCell(2);
                const cellTotal = row.insertCell(3);

                cellFecha.textContent = gasto.fecha;
                cellGasto.textContent = gasto.gasto;
                cellDetalle.textContent = gasto.detalle;
                cellTotal.textContent = totalesPorMes[mesAnio].toFixed(2);
            });
        };

        requestGetAll.onerror = function(event) {
            console.error('Error al obtener los gastos:', event.target.errorCode);
        };
    };
}
