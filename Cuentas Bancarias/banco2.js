document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('banco2-table').getElementsByTagName('tbody')[0];
    const entradaBtn = document.getElementById('entrada-btn');
    const salidaBtn = document.getElementById('salida-btn');

    let db;

    function initIndexedDB() {
        const request = indexedDB.open('Banco2DB', 1);

        request.onerror = function(event) {
            console.log('Error opening IndexedDB', event);
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            loadMovimientos();
        };

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            const objectStore = db.createObjectStore('movimientos', { autoIncrement: true });
            objectStore.createIndex('movimiento', 'movimiento', { unique: false });
            objectStore.createIndex('saldo', 'saldo', { unique: false });
        };
    }

    function loadMovimientos() {
        const transaction = db.transaction(['movimientos'], 'readonly');
        const objectStore = transaction.objectStore('movimientos');
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const movimientos = event.target.result;
            movimientos.forEach(function(mov) {
                const row = tableBody.insertRow();
                const cellMovimiento = row.insertCell(0);
                const cellSaldo = row.insertCell(1);
                cellMovimiento.textContent = formatNumber(mov.movimiento);
                cellSaldo.textContent = formatNumber(mov.saldo);
            });
        };
    }

    function addMovimiento(movimiento, isEntrada) {
        const row = tableBody.insertRow();
        const cellMovimiento = row.insertCell(0);
        const cellSaldo = row.insertCell(1);

        const movimientoDecimal = parseFloat(movimiento).toFixed(2);
        cellMovimiento.textContent = formatNumber(movimientoDecimal);
        
        let saldoAnterior = 0;
        if (tableBody.rows.length > 1) {
            saldoAnterior = parseFloat(tableBody.rows[tableBody.rows.length - 2].cells[1].textContent.replace(/[',]/g, '')) || 0;
        }

        let saldoActual = isEntrada ? saldoAnterior + parseFloat(movimiento) : saldoAnterior - parseFloat(movimiento);
        saldoActual = saldoActual.toFixed(2);
        cellSaldo.textContent = formatNumber(saldoActual);

        const transaction = db.transaction(['movimientos'], 'readwrite');
        const objectStore = transaction.objectStore('movimientos');
        objectStore.add({ movimiento: movimientoDecimal, saldo: saldoActual });

        transaction.oncomplete = function() {
            console.log('Movimiento añadido');
        };

        transaction.onerror = function(event) {
            console.log('Error añadiendo movimiento', event);
        };
    }

    function formatNumber(number) {
        return parseFloat(number).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true
        });
    }

    entradaBtn.addEventListener('click', function() {
        const movimiento = prompt('Ingrese el monto de la entrada:');
        if (movimiento !== null && !isNaN(movimiento)) {
            addMovimiento(movimiento, true);
        }
    });

    salidaBtn.addEventListener('click', function() {
        const movimiento = prompt('Ingrese el monto de la salida:');
        if (movimiento !== null && !isNaN(movimiento)) {
            addMovimiento(movimiento, false);
        }
    });

    initIndexedDB();
});
