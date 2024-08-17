document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', actualizarTablaSandalias);

    actualizarTablaSandalias();
});

function actualizarTablaSandalias() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sandaliasData = JSON.parse(localStorage.getItem('sandalias')) || [];
    const tableBody = document.getElementById('sandalias-table-body');

    // Limpiar el contenido existente de la tabla
    tableBody.innerHTML = '';

    // Filtrar los productos con cantidad mayor que 0
    const productosFiltrados = sandaliasData.filter(function(sandalia) {
        return sandalia.cantidad > 0 &&
            (sandalia.nomProducto.toLowerCase().includes(searchTerm) || 
             sandalia.nit.toLowerCase().includes(searchTerm) ||
             sandalia.valor.toString().toLowerCase().includes(searchTerm));
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

        const valorTotalCell = document.createElement('td');
        valorTotalCell.textContent = (sandalia.valorUnitario * sandalia.cantidad).toFixed(2);
        row.appendChild(valorTotalCell);
       
        const accionesCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = function() {
            mostrarFormularioEdicion(index);
        };
        accionesCell.appendChild(editButton);
        row.appendChild(accionesCell);

        tableBody.appendChild(row);
    });
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
