function procesarVenta(event) {
    event.preventDefault();

    const nombreProducto = document.getElementById('nombreProducto').value;
    const categoria = document.getElementById('categoria').value;
    const precio = document.getElementById('precio').value;
    const nit = document.getElementById('nit').value;
    const cantidad = document.getElementById('cantidad').value;
    const fecha = document.getElementById('fecha').value;

    // Obtener datos actuales de la categoría de localStorage (si existen)
    let datosCategoria = JSON.parse(localStorage.getItem(categoria)) || [];

    // Encontrar el producto por nit y actualizar la cantidad
    let productoEncontrado = false;
    datosCategoria.forEach(function(producto) {
        if (producto.nit === nit) {
            producto.cantidad -= parseInt(cantidad); // Restar la cantidad vendida
            productoEncontrado = true;
        }
    });

    // Si no se encontró el producto por nit, agregar un nuevo producto
    if (!productoEncontrado) {
        datosCategoria.push({ nombreProducto, nit, cantidad: -parseInt(cantidad), precio });
    }

    // Actualizar los datos en localStorage
    localStorage.setItem(categoria, JSON.stringify(datosCategoria));

    // Si la categoría es 'zapatos', agregar la venta a la lista de ventas de zapatos
    if (categoria === 'zapatos') {
        let ventasZapatos = JSON.parse(localStorage.getItem('ventasZapatos')) || [];
        ventasZapatos.push({ producto: nombreProducto, nit, cantidad, precio, fecha });
        localStorage.setItem('ventasZapatos', JSON.stringify(ventasZapatos));
    }
    // Si la categoría es 'sandalias', agregar la venta a la lista de ventas de sandalias
    if (categoria === 'sandalias') {
        let ventasSandalias = JSON.parse(localStorage.getItem('ventasSandalias')) || [];
        ventasSandalias.push({ producto: nombreProducto, nit, cantidad, precio, fecha });
        localStorage.setItem('ventasSandalias', JSON.stringify(ventasSandalias));
    }
    // Si la categoría es 'pijamas', agregar la venta a la lista de ventas de pijamas
    if (categoria === 'pijamas') {
        let ventasPijamas = JSON.parse(localStorage.getItem('ventasPijamas')) || [];
        ventasPijamas.push({ producto: nombreProducto, nit, cantidad, precio, fecha });
        localStorage.setItem('ventasPijamas', JSON.stringify(ventasPijamas));
    }
    // Si la categoría es 'ropa interior', agregar la venta a la lista de ventas de ropa interior
    if (categoria === 'ropa_interior') {
        let ventasInterior = JSON.parse(localStorage.getItem('ventasInterior')) || [];
        ventasInterior.push({ producto: nombreProducto, nit, cantidad, precio, fecha });
        localStorage.setItem('ventasInterior', JSON.stringify(ventasInterior));
    }
    // Si la categoría es 'ropa', agregar la venta a la lista de ventas de ropa
    if (categoria === 'ropa') {
        let ventasRopa = JSON.parse(localStorage.getItem('ventasRopa')) || [];
        ventasRopa.push({ producto: nombreProducto, nit, cantidad, precio, fecha });
        localStorage.setItem('ventasRopa', JSON.stringify(ventasRopa));
    }

    alert('Venta procesada correctamente.');

    // Limpiar el formulario después de procesar la venta
    document.getElementById('ventas-form').reset();
}
