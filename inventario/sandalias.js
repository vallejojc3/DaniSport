document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', actualizarTablaSandalias);

    actualizarTablaSandalias();
});

function actualizarTablaSandalias() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sandaliasData = JSON.parse(localStorage.getItem('sandalias')) || [];
    const tableBody = document.getElementById('sandalias-table-body');

    tableBody.innerHTML = '';  // Limpiar el contenido existente de la tabla

    // Fragmento de documento para evitar reflujo del DOM
    const fragment = document.createDocumentFragment();

    // Filtrar los productos con cantidad mayor que 0 y que coincidan con la búsqueda
    const productosFiltrados = sandaliasData.filter(function(sandalia) {
        return sandalia.cantidad > 0 &&
            (sandalia.nomProducto.toLowerCase().includes(searchTerm) || 
             sandalia.nit.toLowerCase().includes(searchTerm) ||
             sandalia.valor.toString().toLowerCase().includes(searchTerm) ||
             (sandalia.detalle && sandalia.detalle.toLowerCase().includes(searchTerm)));
    });

    productosFiltrados.forEach(function(sandalia, index) {
        const row = document.createElement('tr');

        const nomProductoCell = document.createElement('td');
        nomProductoCell.textContent = sandalia.nomProducto;
        row.appendChild(nomProductoCell);

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = sandalia.cantidad;
        row.appendChild(cantidadCell);

        const nitCell = document.createElement('td');
        nitCell.textContent = sandalia.nit;
        row.appendChild(nitCell);

        const valorUnitarioCell = document.createElement('td');
        valorUnitarioCell.textContent = sandalia.valorUnitario ? sandalia.valorUnitario.toFixed(2) : 'N/A';
        row.appendChild(valorUnitarioCell);

        const valorTotal = sandalia.valorUnitario * sandalia.cantidad;
        const valorTotalCell = document.createElement('td');
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

        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);  // Añadir todo el fragmento al DOM de una vez
}

function mostrarFormularioEdicion(index) {
    const sandaliasData = JSON.parse(localStorage.getItem('sandalias')) || [];
    const sandalia = sandaliasData[index];

    document.getElementById('editNomProducto').value = sandalia.nomProducto;
    document.getElementById('editNit').value = sandalia.nit;
    document.getElementById('editValor').value = sandalia.valor;
    document.getElementById('editValorUnitario').value = sandalia.valorUnitario || 0;
    document.getElementById('editCantidad').value = sandalia.cantidad;

    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'block';

    const editForm = document.getElementById('editForm');
    editForm.onsubmit = function(event) {
        event.preventDefault();
        guardarCambiosEdicion(index);
    };
}
function eliminarProducto(index) {
    const sandaliasData = JSON.parse(localStorage.getItem('sandalias')) || [];
    sandaliasData.splice(index, 1); // Remueve el producto del array
    localStorage.setItem('sandalias', JSON.stringify(sandaliasData)); // Guarda el array actualizado
    actualizarTablaSandalias(); // Actualiza la tabla
}


function guardarCambiosEdicion(index) {
    const sandaliasData = JSON.parse(localStorage.getItem('sandalias')) || [];
    const sandalia = sandaliasData[index];

    sandalia.nomProducto = document.getElementById('editNomProducto').value;
    sandalia.nit = document.getElementById('editNit').value;
    sandalia.valor = parseFloat(document.getElementById('editValor').value);
    sandalia.valorUnitario = parseFloat(document.getElementById('editValorUnitario').value);
    sandalia.cantidad = parseInt(document.getElementById('editCantidad').value);

    sandaliasData[index] = sandalia;
    localStorage.setItem('sandalias', JSON.stringify(sandaliasData));

    cerrarFormularioEdicion();
    actualizarTablaSandalias();
}

function cerrarFormularioEdicion() {
    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'none';
}

// Función para mostrar el total del inventario
function mostrarTotalInventario() {
    const sandaliasData = JSON.parse(localStorage.getItem('sandalias')) || [];
    let totalInventario = 0;

    sandaliasData.forEach(function(sandalia) {
        const valorUnitario = parseFloat(sandalia.valorUnitario);
        const cantidad = parseInt(sandalia.cantidad);

        if (!isNaN(valorUnitario) && !isNaN(cantidad)) {
            totalInventario += valorUnitario * cantidad;
        }
    });

    alert('El total del inventario es: ' + totalInventario.toFixed(2));
}
