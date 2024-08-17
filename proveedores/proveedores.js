document.addEventListener('DOMContentLoaded', function() {
    const agregarProveedorBtn = document.getElementById('agregarProveedorBtn');
    const eliminarProveedorBtn = document.getElementById('eliminarProveedorBtn');
    const editarProveedorBtn = document.getElementById('editarProveedorBtn');
    
    agregarProveedorBtn.addEventListener('click', agregarProveedor);
    eliminarProveedorBtn.addEventListener('click', eliminarProveedor);
    editarProveedorBtn.addEventListener('click', editarProveedor);
    
    cargarProveedores();
});

function agregarProveedor() {
    const buttonContainer = document.querySelector('.button-container');
    const numButtons = buttonContainer.querySelectorAll('button').length;
    
    if (numButtons >= 16) {
        alert('No se pueden agregar más proveedores.');
        return;
    }
    
    const nuevoProveedorNumero = numButtons + 1;
    const nuevoProveedorNombre = prompt(`Ingrese el nombre del nuevo proveedor (Proveedor ${nuevoProveedorNumero}):`);

    if (nuevoProveedorNombre && nuevoProveedorNombre.trim() !== "") {
        const nuevoBoton = crearBotonProveedor(nuevoProveedorNumero, nuevoProveedorNombre);
        buttonContainer.appendChild(nuevoBoton);
        guardarProveedor(nuevoProveedorNumero, nuevoProveedorNombre);
        actualizarSelectProveedores(nuevoProveedorNombre); // Actualizar las opciones del select de proveedores
    } else {
        alert('El nombre del proveedor no puede estar vacío.');
    }
}

function crearBotonProveedor(numero, nombre) {
    const nuevoBoton = document.createElement('button');
    nuevoBoton.textContent = nombre;
    nuevoBoton.id = `proveedor${numero}`;
    nuevoBoton.onclick = function() {
        window.location.href = `/proveedores/proveedor${numero}.html`;
    };
    return nuevoBoton;
}

function guardarProveedor(numero, nombre) {
    let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    proveedores.push({ numero, nombre });
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
}

function cargarProveedores() {
    const buttonContainer = document.querySelector('.button-container');
    let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];

    // Eliminar proveedores con nombres vacíos del localStorage
    proveedores = proveedores.filter(proveedor => proveedor.nombre && proveedor.nombre.trim() !== "");
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
    
    proveedores.forEach(function(proveedor) {
        const nuevoBoton = crearBotonProveedor(proveedor.numero, proveedor.nombre);
        buttonContainer.appendChild(nuevoBoton);
        actualizarSelectProveedores(proveedor.nombre); // Actualizar las opciones del select de proveedores
    });
}

function eliminarProveedor() {
    const nombreProveedor = prompt('Ingrese el nombre del proveedor que desea eliminar:');
    
    if (nombreProveedor) {
        let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
        proveedores = proveedores.filter(proveedor => proveedor.nombre !== nombreProveedor);
        localStorage.setItem('proveedores', JSON.stringify(proveedores));
        
        const buttonContainer = document.querySelector('.button-container');
        const botones = buttonContainer.querySelectorAll('button');
        
        botones.forEach(function(boton) {
            if (boton.textContent === nombreProveedor) {
                buttonContainer.removeChild(boton);
            }
        });

        eliminarSelectProveedor(nombreProveedor); // Eliminar la opción del select de proveedores
    }
}

function editarProveedor() {
    const nombreProveedor = prompt('Ingrese el nombre del proveedor que desea editar:');
    
    if (nombreProveedor) {
        let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
        const proveedor = proveedores.find(proveedor => proveedor.nombre === nombreProveedor);
        
        if (proveedor) {
            const nuevoNombre = prompt(`Ingrese el nuevo nombre para ${nombreProveedor}:`);
            if (nuevoNombre && nuevoNombre.trim() !== "") {
                // Actualizar el nombre del proveedor
                proveedor.nombre = nuevoNombre;
                localStorage.setItem('proveedores', JSON.stringify(proveedores));

                // Actualizar el texto del botón
                const boton = document.getElementById(`proveedor${proveedor.numero}`);
                boton.textContent = nuevoNombre;

                // Actualizar la opción del select de proveedores
                actualizarSelectProveedores(nombreProveedor, nuevoNombre);
            } else {
                alert('El nombre del proveedor no puede estar vacío.');
            }
        } else {
            alert('Proveedor no encontrado.');
        }
    }
}

function actualizarSelectProveedores(nombreAntiguo, nombreNuevo = null) {
    const selectProveedor = document.getElementById('proveedor');
    const optionExistente = document.querySelector(`#proveedor option[value="${nombreAntiguo}"]`);

    // Si existe la opción antigua, eliminarla
    if (optionExistente) {
        selectProveedor.removeChild(optionExistente);
    }

    // Añadir la nueva opción si se proporciona un nuevo nombre
    if (nombreNuevo) {
        const nuevaOption = document.createElement('option');
        nuevaOption.value = nombreNuevo;
        nuevaOption.textContent = nombreNuevo;
        selectProveedor.appendChild(nuevaOption);
    }
}

function eliminarSelectProveedor(nombreProveedor) {
    const selectProveedor = document.getElementById('proveedor');
    const optionEliminar = document.querySelector(`#proveedor option[value="${nombreProveedor}"]`);

    // Si existe la opción, eliminarla del select
    if (optionEliminar) {
        selectProveedor.removeChild(optionEliminar);
    }
}
