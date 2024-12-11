// Función para guardar el error o sugerencia

function guardarError() {
    const descripcion = document.getElementById('errorDescription').value;
    const pdfName = url.split('/').pop(); // Obtener el nombre del PDF afectado

    if (descripcion.trim() === '') {
        alert('Por favor, describe el error o sugerencia.');
        return;
    }

    // Crear el objeto de error
    const errorData = {
        ruta: pdfName,
        descripcion: descripcion,
        fecha: new Date().toISOString()
    };

    // Enviar los datos al servidor para guardar
    fetch('/Error/GuardarError', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Reporte guardado exitosamente.');
                document.getElementById('errorDialog').close();
                document.body.classList.remove('modal-open');
            } else {
                alert('Error al guardar el reporte: ' + data.message);
            }
        })
        .catch(error => console.error('Error al guardar el reporte:', error));
}




function cargarErrores() {
    fetch('/Error/ObtenerErrores')
        .then(response => response.json())
        .then(data => {
            let tablaErrores = document.getElementById('tablaErrores');
            tablaErrores.innerHTML = ''; // Limpiar la tabla

            if (data.length === 0) {
                // Si no hay errores, mostrar un mensaje en la tabla
                tablaErrores.innerHTML = `<tr><td colspan="4">No se encontraron registros de errores.</td></tr>`;
                return;
            }

            // Si hay errores, iterar sobre los datos y crear las filas
            data.forEach(error => {
                console.log(error); // Para verificar la estructura de los datos
                let fila = `<tr>
                                <td>${error.id || 'Sin ID'}</td>
                                <td>${error.ruta || 'Sin Ruta'}</td>
                                <td>${error.descripcion || 'Sin Descripción'}</td>
                                <td>${error.fecha ? new Date(error.fecha).toLocaleString() : 'Fecha Inválida'}</td> <!-- Formatear la fecha -->
                            </tr>`;
                tablaErrores.innerHTML += fila;
            });
        })
        .catch(error => console.error('Error al cargar los registros:', error));
}