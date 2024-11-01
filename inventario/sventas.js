document.addEventListener('DOMContentLoaded', function() {
    const ventasSandalias = JSON.parse(localStorage.getItem('ventasSandalias')) || [];
    const proveedoresData = JSON.parse(localStorage.getItem('proveedores')) || [];
    const ventasTable = document.getElementById('ventasTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');

    let currentDate = new Date().toLocaleDateString();
    let dailyTotal = 0;

    function displayVentas(ventas) {
        ventasTable.innerHTML = '';

        ventas.forEach(function(venta, index) {
            const row = ventasTable.insertRow();
            const cellFecha = row.insertCell(0);
            const cellProducto = row.insertCell(1);
            const cellCantidad = row.insertCell(2);
            const cellNit = row.insertCell(3);
            const cellValorUnitario = row.insertCell(4);
            const cellPrecio = row.insertCell(5);          
            const cellUtilidad = row.insertCell(6);
            const cellTotal = row.insertCell(7);
            const cellAcciones = row.insertCell(8);

            cellProducto.textContent = venta.producto;
            cellNit.textContent = venta.nit;
            cellPrecio.textContent = venta.precio;
            cellCantidad.textContent = venta.cantidad;
            cellFecha.textContent = venta.fecha;

            // Calcular el valor unitario basado en los datos de proveedores
            const proveedor = proveedoresData.find(p => p.nit === venta.nit);
            let valorUnitario = 0;
            if (proveedor && proveedor.cantidad > 0) {
                valorUnitario = (proveedor.valor / proveedor.cantidad).toFixed(2);
                cellValorUnitario.textContent = valorUnitario;
            } else {
                cellValorUnitario.textContent = 'N/A';
            }

            // Calcular el total del día
            if (new Date(venta.fecha).toLocaleDateString() === currentDate) {
                dailyTotal += parseFloat(venta.precio) * parseFloat(venta.cantidad);
            } else {
                dailyTotal = parseFloat(venta.precio) * parseFloat(venta.cantidad);
                currentDate = new Date(venta.fecha).toLocaleDateString();
            }
            cellTotal.textContent = dailyTotal.toFixed(2);

            // Calcular la utilidad
            if (valorUnitario !== 'N/A') {
                const utilidad = parseFloat(venta.precio) - parseFloat(valorUnitario);
                cellUtilidad.textContent = utilidad.toFixed(2);
            } else {
                cellUtilidad.textContent = 'N/A';
            }

            // Botón de Editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', function() {
                editVenta(index);
            });
            cellAcciones.appendChild(editButton);

            // Botón de Eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.style.marginLeft = '10px'; // Espacio entre los botones
            deleteButton.addEventListener('click', function() {
                deleteVenta(index);
            });
            cellAcciones.appendChild(deleteButton);
        });
    }

    function filterVentas() {
        const query = searchInput.value.toLowerCase();
        const filteredVentas = ventasSandalias.filter(venta => {
            return (
                venta.producto.toLowerCase().includes(query) ||
                venta.nit.toLowerCase().includes(query) ||
                venta.fecha.toLowerCase().includes(query)
            );
        });
        displayVentas(filteredVentas);
    }

    function editVenta(index) {
        const venta = ventasSandalias[index];
        const newFecha = prompt('Editar Fecha:', venta.fecha);
        const newProducto = prompt('Editar Producto:', venta.producto);
        const newNit = prompt('Editar NIT:', venta.nit);
        const newPrecio = prompt('Editar Precio:', venta.precio);
        const newCantidad = prompt('Editar Cantidad:', venta.cantidad);

        if (newFecha && newProducto && newNit && newPrecio && newCantidad) {
            ventasSandalias[index] = {
                fecha: newFecha,
                producto: newProducto,
                nit: newNit,
                precio: parseFloat(newPrecio).toFixed(2),
                cantidad: parseInt(newCantidad)
            };
            localStorage.setItem('ventasSandalias', JSON.stringify(ventasSandalias));
            displayVentas(ventasSandalias);
        }
    }

    function deleteVenta(index) {
        if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
            ventasSandalias.splice(index, 1);  // Elimina la venta del array
            localStorage.setItem('ventasSandalias', JSON.stringify(ventasSandalias)); // Actualiza el localStorage
            displayVentas(ventasSandalias); // Refresca la tabla
        }
    }

    searchInput.addEventListener('input', filterVentas);
    displayVentas(ventasSandalias);

    if (ventasSandalias.length === 0) {
        alert('No hay datos de venta disponibles.');
    }
});
