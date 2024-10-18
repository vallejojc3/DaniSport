document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', actualizarTablaRopa);

    actualizarTablaRopa();
});

function actualizarTablaRopa() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const ropaData = JSON.parse(localStorage.getItem('ropa')) || [];
    const tableBody = document.getElementById('ropa-table-body');

    // Limpiar el contenido existente de la tabla
    tableBody.innerHTML = '';

    // Filtrar los productos con cantidad mayor que 0 y que coincidan con la búsqueda
    const productosFiltrados = ropaData.filter(function(ropa) {
        return ropa.cantidad > 0 && (
            ropa.nomProducto.toLowerCase().includes(searchTerm) ||
            ropa.nit.toLowerCase().includes(searchTerm) ||
            ropa.valor.toString().toLowerCase().includes(searchTerm) ||
            ropa.valorUnitario.toString().toLowerCase().includes(searchTerm) ||
            ropa.cantidad.toString().toLowerCase().includes(searchTerm)
        );
    });
 
    productosFiltrados.forEach(function(ropa, index) {
        const row = document.createElement('tr');

        const nomProductoCell = document.createElement('td');
        nomProductoCell.textContent = ropa.nomProducto;
        row.appendChild(nomProductoCell);

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = ropa.cantidad;
        row.appendChild(cantidadCell);

        const nitCell = document.createElement('td');
        nitCell.textContent = ropa.nit;
        row.appendChild(nitCell);

        const valorUnitarioCell = document.createElement('td');
        valorUnitarioCell.textContent = ropa.valorUnitario.toFixed(2);
        row.appendChild(valorUnitarioCell);

        const valorTotal = ropa.valorUnitario * ropa.cantidad;
        const valorTotalCell = document.createElement('td');
        valorTotalCell.textContent = valorTotal.toFixed(2);
        row.appendChild(valorTotalCell);

        const accionesCell = document.createElement('td');
        const editarButton = document.createElement('button');
        editarButton.textContent = 'Editar';
        editarButton.addEventListener('click', function() {
            editarRopa(index);
        });
        accionesCell.appendChild(editarButton);
        row.appendChild(accionesCell);

        tableBody.appendChild(row);
    });
}

function editarRopa(index) {
    const ropaData = JSON.parse(localStorage.getItem('ropa')) || [];
    const ropa = ropaData[index];

    document.getElementById('editNomProducto').value = ropa.nomProducto;
    document.getElementById('editNit').value = ropa.nit;
    document.getElementById('editValor').value = ropa.valor;
    document.getElementById('editValorUnitario').value = ropa.valorUnitario;
    document.getElementById('editCantidad').value = ropa.cantidad;

    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'block';

    const editForm = document.getElementById('editForm');
    editForm.onsubmit = function(event) {
        event.preventDefault();
        guardarCambiosEdicion(index);
    };
}

function guardarCambiosEdicion(index) {
    const ropaData = JSON.parse(localStorage.getItem('ropa')) || [];
    const ropa = ropaData[index];

    ropa.nomProducto = document.getElementById('editNomProducto').value;
    ropa.nit = document.getElementById('editNit').value;
    ropa.valor = parseFloat(document.getElementById('editValor').value);
    ropa.valorUnitario = parseFloat(document.getElementById('editValorUnitario').value);
    ropa.cantidad = parseInt(document.getElementById('editCantidad').value);

    ropaData[index] = ropa;
    localStorage.setItem('ropa', JSON.stringify(ropaData));

    cerrarFormularioEdicion();
    actualizarTablaRopa();
}

function cerrarFormularioEdicion() {
    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'none';
}
document.getElementById('totalInventarioBtn').addEventListener('click', function() {
    const ropaData = JSON.parse(localStorage.getItem('ropa')) || [];
    let totalInventario = 0;

    ropaData.forEach(function(ropa) {
        const valorTotal = ropa.valorUnitario * ropa.cantidad;
        totalInventario += valorTotal;
    });

    alert("El total del inventario es: " + totalInventario.toFixed(2));
});
