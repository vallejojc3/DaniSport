// Abrir o crear la base de datos
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('miBaseDeDatos', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore('miObjectStore', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('key', 'key', { unique: true });
            objectStore.createIndex('value', 'value', { unique: false });
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Guardar datos en indexedDB
function saveData(db, key, value) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['miObjectStore'], 'readwrite');
        const objectStore = transaction.objectStore('miObjectStore');

        const request = objectStore.put({ key: key, value: value });

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Obtener datos de indexedDB
function getData(db, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['miObjectStore'], 'readonly');
        const objectStore = transaction.objectStore('miObjectStore');

        const request = objectStore.index('key').get(key);

        request.onsuccess = (event) => {
            resolve(event.target.result ? event.target.result.value : null);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const guardarBtn = document.getElementById('guardar-btn');
    const editarBtn = document.getElementById('editar-btn');
    const bancosTable = document.getElementById('bancos-table').getElementsByTagName('tbody')[0];

    // Abrir la base de datos al cargar la página
    openDatabase().then(db => {
        // Cargar datos desde indexedDB al cargar la página
        cargarDatos(db);

        guardarBtn.addEventListener('click', function() {
            const fila = bancosTable.rows[0];
            const datos = {
                banco1: fila.cells[0].textContent,
                banco2: fila.cells[1].textContent,
                banco3: fila.cells[2].textContent
            };
            saveData(db, 'datosBancos', datos).then(() => {
                alert('Datos guardados correctamente.');

                // Desactivar la edición de las celdas
                for (let cell of fila.cells) {
                    cell.setAttribute('contenteditable', 'false');
                }
            }).catch(error => {
                console.error('Error al guardar datos:', error);
            });
        });

        editarBtn.addEventListener('click', function() {
            const fila = bancosTable.rows[0];
            for (let cell of fila.cells) {
                cell.setAttribute('contenteditable', 'true');
            }
            alert('Ahora puedes editar los datos.');
        });
    }).catch(error => {
        console.error('Error al abrir la base de datos:', error);
    });

    function cargarDatos(db) {
        getData(db, 'datosBancos').then(datos => {
            if (datos) {
                const fila = bancosTable.rows[0];
                fila.cells[0].textContent = datos.banco1;
                fila.cells[1].textContent = datos.banco2;
                fila.cells[2].textContent = datos.banco3;

                // Desactivar la edición de las celdas al cargar los datos
                for (let cell of fila.cells) {
                    cell.setAttribute('contenteditable', 'false');
                }
            }
        }).catch(error => {
            console.error('Error al cargar datos:', error);
        });
    }
});
