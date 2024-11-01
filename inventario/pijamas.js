document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', actualizarTablaPijamas);

    actualizarTablaPijamas();
});

function actualizarTablaPijamas() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const pijamasData = JSON.parse(localStorage.getItem('pijamas')) || [];
    const tableBody = document.getElementById('pijamas-table-body');

    // Limpiar el contenido existente de la tabla
    tableBody.innerHTML = '';

    // Filtrar los productos con cantidad mayor que 0
    const productosFiltrados = pijamasData.filter(function(pijama) {
        return pijama.cantidad > 0 &&
            (pijama.nomProducto.toLowerCase().includes(searchTerm) || 
             pijama.nit.toLowerCase().includes(searchTerm) ||
             pijama.valor.toString().toLowerCase().includes(searchTerm) ||
             pijama.valorUnitario.toString().toLowerCase().includes(searchTerm) ||
             pijama.cantidad.toString().includes(searchTerm));
    });

    productosFiltrados.forEach(function(pijama, index) {
        const row = document.createElement('tr');

        const nomProductoCell = document.createElement('td');
        nomProductoCell.textContent = pijama.nomProducto;
        row.appendChild(nomProductoCell);

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = pijama.cantidad;
        row.appendChild(cantidadCell);

        const nitCell = document.createElement('td');
        nitCell.textContent = pijama.nit;
        row.appendChild(nitCell);

        const valorUnitarioCell = document.createElement('td');
        valorUnitarioCell.textContent = pijama.valorUnitario.toFixed(2);
        row.appendChild(valorUnitarioCell);



        const valorTotalCell = document.createElement('td');
        const valorTotal = pijama.valorUnitario * pijama.cantidad;
        valorTotalCell.textContent = valorTotal.toFixed(2);
        row.appendChild(valorTotalCell);

        const accionesCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = function() {
            mostrarFormularioEdicion(index);
        };
        accionesCell.appendChild(editButton);

        const eliminarButton = document.createElement('button');
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.onclick = function() {
            eliminarProducto(index);
        };
        accionesCell.appendChild(eliminarButton);

        row.appendChild(accionesCell);

        tableBody.appendChild(row);
    });
}

function mostrarFormularioEdicion(index) {
    const pijamasData = JSON.parse(localStorage.getItem('pijamas')) || [];
    const pijama = pijamasData[index];

    document.getElementById('editNomProducto').value = pijama.nomProducto;
    document.getElementById('editNit').value = pijama.nit;
    document.getElementById('editValor').value = pijama.valor;
    document.getElementById('editValorUnitario').value = pijama.valorUnitario;
    document.getElementById('editCantidad').value = pijama.cantidad;

    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'block';

    const editForm = document.getElementById('editForm');
    editForm.onsubmit = function(event) {
        event.preventDefault();
        guardarCambiosEdicion(index);
    };
}

function guardarCambiosEdicion(index) {
    const pijamasData = JSON.parse(localStorage.getItem('pijamas')) || [];
    const pijama = pijamasData[index];

    pijama.nomProducto = document.getElementById('editNomProducto').value;
    pijama.nit = document.getElementById('editNit').value;
    pijama.valor = parseFloat(document.getElementById('editValor').value);
    pijama.valorUnitario = parseFloat(document.getElementById('editValorUnitario').value);
    pijama.cantidad = parseInt(document.getElementById('editCantidad').value);

    pijamasData[index] = pijama;
    localStorage.setItem('pijamas', JSON.stringify(pijamasData));

    cerrarFormularioEdicion();
    actualizarTablaPijamas();
}

function cerrarFormularioEdicion() {
    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'none';
}

function eliminarProducto(index) {
    const pijamaData = JSON.parse(localStorage.getItem('pijamas')) || [];
    pijamaData.splice(index, 1); // Remueve el producto del array
    localStorage.setItem('pijamas', JSON.stringify(pijamaData)); // Guarda el array actualizado
    actualizarTablaPijamas(); // Actualiza la tabla
}

 
document.getElementById('totalInventarioBtn').addEventListener('click', function() {
    const pijamasData = JSON.parse(localStorage.getItem('pijamas')) || [];
    let totalInventario = 0;

    pijamasData.forEach(function(pijama) {
        const valorTotal = pijama.valorUnitario * pijama.cantidad;
        totalInventario += valorTotal;
    });

    alert("El total del inventario es: " + totalInventario.toFixed(2));
});
