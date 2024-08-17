document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', actualizarTablaInterior);

    actualizarTablaInterior();
});

function actualizarTablaInterior() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const interiorData = JSON.parse(localStorage.getItem('ropa_interior')) || [];
    const tableBody = document.getElementById('interior-table-body');

    tableBody.innerHTML = '';

    const productosFiltrados = interiorData.filter(function(interior) {
        return interior.cantidad > 0 && (
            interior.nomProducto.toLowerCase().includes(searchTerm) ||
            interior.nit.toLowerCase().includes(searchTerm) ||
            interior.valor.toFixed(2).includes(searchTerm) ||
            Math.round(interior.valorUnitario).toString().includes(searchTerm) ||
            interior.cantidad.toString().includes(searchTerm)
        );
    });

    productosFiltrados.forEach(function(interior, index) {
        const row = document.createElement('tr');

        const nomProductoCell = document.createElement('td');
        nomProductoCell.textContent = interior.nomProducto || 'N/A';
        row.appendChild(nomProductoCell);

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = interior.cantidad;
        row.appendChild(cantidadCell);

        const nitCell = document.createElement('td');
        nitCell.textContent = interior.nit || 'N/A';
        row.appendChild(nitCell);

        const valorUnitarioCell = document.createElement('td');
        valorUnitarioCell.textContent = Math.round(interior.valorUnitario);
        row.appendChild(valorUnitarioCell);

        const precioCell = document.createElement('td');
        precioCell.textContent = (interior.valorUnitario * interior.cantidad).toFixed(2);
        row.appendChild(precioCell);

        const accionesCell = document.createElement('td');
        const editarButton = document.createElement('button');
        editarButton.textContent = 'Editar';
        editarButton.addEventListener('click', function() {
            editarFila(row, interior, index);
        });
        accionesCell.appendChild(editarButton);
        row.appendChild(accionesCell);

        tableBody.appendChild(row);
    });
}

function editarFila(row, interior, index) {
    const cells = row.getElementsByTagName('td');
    cells[0].innerHTML = `<input type="text" value="${interior.nomProducto}">`;
    cells[1].innerHTML = `<input type="number" value="${interior.cantidad}">`;
    cells[2].innerHTML = `<input type="text" value="${interior.nit}">`;
    cells[3].innerHTML = `<input type="number" value="${Math.round(interior.valorUnitario)}">`;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar';
    saveButton.addEventListener('click', function() {
        guardarCambios(row, interior, index);
    });

    const accionesCell = cells[5];
    accionesCell.innerHTML = '';
    accionesCell.appendChild(saveButton);
}

function guardarCambios(row, interior, index) {
    const inputs = row.getElementsByTagName('input');
    interior.nomProducto = inputs[0].value;
    interior.cantidad = parseInt(inputs[1].value);
    interior.nit = inputs[2].value;
    interior.valorUnitario = Math.round(parseFloat(inputs[3].value));

    let interiorData = JSON.parse(localStorage.getItem('ropa_interior')) || [];
    interiorData[index] = interior;
    localStorage.setItem('ropa_interior', JSON.stringify(interiorData));
    actualizarTablaInterior();
}
