
//Este dato es el unico que se tiene que cambiar para mantener escalable la aplicacion. Respetar el nombre o modificar
//el nombre de ser necesario.
document.addEventListener('DOMContentLoaded', function () {

    // Extrae el nombre del archivo de la URL
    let fileName = url.split('/').pop(); // Extrae el nombre completo del archivo "Manual SAP,Alta y Baja de Usuario.pdf"

    // Elimina la extensión ".pdf" si es necesario
    fileName = fileName.replace('.pdf', '');

    // Divide el nombre del archivo por la coma
    const fileParts = fileName.split(',');

    // Asigna las partes a los elementos HTML
    const titleElement = document.querySelector('.title h2');
    const subtitleElement = document.querySelector('.title p');

    // Usa la primera parte como título y la segunda como subtítulo
    const mainTitle = fileParts[0] || 'Título predeterminado';
    const subTitle = fileParts[1] || 'Subtítulo predeterminado';

    titleElement.textContent = mainTitle;
    subtitleElement.textContent = subTitle;

    // Formatea el título para la pestaña del navegador
    const formattedTitle = `${mainTitle} - ${subTitle}`;

    // Actualiza el título de la pestaña del navegador
    document.title = formattedTitle;
});

// Función para obtener los datos de contacto y llenar el modal


function fillContactCard(url) {
    // Realizar una solicitud fetch al método en el controlador
    fetch(`${url}`)  // Llama al método "GetContactInfo" en el controlador "Desarrollo"
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            // Llenar los campos del modal con los datos recibidos

            document.getElementById('contactEmail').textContent = data.correo;
            document.getElementById('contactPhone').textContent = data.telefono;
            document.getElementById('ext').textContent = data.ext;
            document.getElementById('contactArea').textContent = data.area;

            // Abrir el modal
            document.getElementById('contactCardDialog').showModal();
        })
        .catch(error => console.error('Error al obtener los datos:', error));
}

// Event listener para abrir el modal al hacer clic en el botón, pasando la URL
document.getElementById('openContactCardBtn').addEventListener('click', () => fillContactCard(Contacto));

// Cerrar el modal al hacer clic en la "X"
document.getElementById('closeContactCardBtn').addEventListener('click', () => {
    document.getElementById('contactCardDialog').close();
});

