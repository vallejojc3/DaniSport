function guardarDatos() {
    // Recuperar los datos del formulario
    const nit = document.getElementById('nit').value;
    const nomProducto = document.getElementById('nomproducto').value;
    const proveedor = document.getElementById('proveedor').value;
    const valor = parseInt(document.getElementById('valor').value);
    const cancelado = parseInt(document.getElementById('cancelado').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const fecha = document.getElementById('fecha').value;
    const categoria = document.getElementById('categoria').value;

    // Validar que los valores son números enteros
    if (isNaN(valor) || isNaN(cancelado) || isNaN(cantidad)) {
        alert('Por favor, ingrese valores numéricos para Valor, Cancelado y Cantidad.');
        return;
    } 

    // Calcular el valor unitario
    const valorUnitario = valor / cantidad;

    // Guardar datos en 'proveedores'
    let datosProveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    datosProveedores.push({ nit, nomProducto, proveedor, valor, cancelado, cantidad, fecha, categoria, valorUnitario });
    localStorage.setItem('proveedores', JSON.stringify(datosProveedores));

    // Guardar datos según la categoría
    let categoriaDatos = JSON.parse(localStorage.getItem(categoria)) || [];
    categoriaDatos.push({ nomProducto, nit, valor, cantidad, valorUnitario });
    localStorage.setItem(categoria, JSON.stringify(categoriaDatos));

    // Guardar datos según el proveedor
    let proveedorDatos = JSON.parse(localStorage.getItem(proveedor)) || [];
    proveedorDatos.push({ fecha, nit, nomProducto, proveedor, valor, cancelado, valorUnitario, cantidad,  categoria });
    localStorage.setItem(proveedor, JSON.stringify(proveedorDatos));

    // Mostrar un mensaje de confirmación
    alert('Datos guardados correctamente');

    // Limpiar los campos del formulario
    document.getElementById('nit').value = '';
    document.getElementById('nomproducto').value = '';
    document.getElementById('proveedor').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('cancelado').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('categoria').value = '';
}