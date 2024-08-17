document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', actualizarTablaZapatos);

    actualizarTablaZapatos();
});

function actualizarTablaZapatos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const zapatosData = JSON.parse(localStorage.getItem('zapatos')) || [];
    const tableBody = document.getElementById('zapatos-table-body');

    // Limpiar el contenido existente de la tabla
    tableBody.innerHTML = '';

    // Filtrar los productos con cantidad mayor que 0 y que coincidan con la búsqueda
    const productosFiltrados = zapatosData.filter(function(zapato) {
        return zapato.cantidad > 0 &&
            (zapato.nomProducto.toLowerCase().includes(searchTerm) || 
             zapato.nit.toLowerCase().includes(searchTerm) ||
             zapato.valor.toString().toLowerCase().includes(searchTerm) ||
             (zapato.detalle && zapato.detalle.toLowerCase().includes(searchTerm)));
    });

    productosFiltrados.forEach(function(zapato, index) {
        const row = document.createElement('tr');

        const nomProductoCell = document.createElement('td');
        nomProductoCell.textContent = zapato.nomProducto;
        row.appendChild(nomProductoCell);

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = zapato.cantidad;
        row.appendChild(cantidadCell);

        const nitCell = document.createElement('td');
        nitCell.textContent = zapato.nit;
        row.appendChild(nitCell);

        const valorUnitarioCell = document.createElement('td');
        valorUnitarioCell.textContent = zapato.valorUnitario.toFixed(2);
        row.appendChild(valorUnitarioCell);

        const valorTotal = zapato.valorUnitario * zapato.cantidad;
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
        row.appendChild(accionesCell);

        tableBody.appendChild(row);
    });
}

function mostrarFormularioEdicion(index) {
    const zapatosData = JSON.parse(localStorage.getItem('zapatos')) || [];
    const zapato = zapatosData[index];

    document.getElementById('editNomProducto').value = zapato.nomProducto;
    document.getElementById('editNit').value = zapato.nit;
    document.getElementById('editValor').value = zapato.valor;
    document.getElementById('editValorUnitario').value = zapato.valorUnitario;
    document.getElementById('editCantidad').value = zapato.cantidad;

    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'block';

    const editForm = document.getElementById('editForm');
    editForm.onsubmit = function(event) {
        event.preventDefault();
        guardarCambiosEdicion(index);
    };
}

function guardarCambiosEdicion(index) {
    const zapatosData = JSON.parse(localStorage.getItem('zapatos')) || [];
    const zapato = zapatosData[index];

    zapato.nomProducto = document.getElementById('editNomProducto').value;
    zapato.nit = document.getElementById('editNit').value;
    zapato.valor = parseFloat(document.getElementById('editValor').value);
    zapato.valorUnitario = parseFloat(document.getElementById('editValorUnitario').value);
    zapato.cantidad = parseInt(document.getElementById('editCantidad').value);

    zapatosData[index] = zapato;
    localStorage.setItem('zapatos', JSON.stringify(zapatosData));

    cerrarFormularioEdicion();
    actualizarTablaZapatos();
}

function cerrarFormularioEdicion() {
    const formContainer = document.getElementById('editFormContainer');
    formContainer.style.display = 'none';
}
 