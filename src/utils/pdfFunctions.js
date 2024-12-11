// Función para descargar el PDF
function downloadPDFPlaid() {
    // Extrae el nombre del archivo desde la URL
    let fileName = url.split('/').pop(); // Toma la última parte del URL que es el nombre del archivo
    fileName = fileName.replace('.pdf', ''); // Remueve la extensión .pdf

    // Genera la fecha y hora en formato deseado: yyyyMMdd_HHmm
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.getFullYear() +
        ('0' + (currentDateTime.getMonth() + 1)).slice(-2) +
        ('0' + currentDateTime.getDate()).slice(-2) + '_' +
        ('0' + currentDateTime.getHours()).slice(-2) +
        ('0' + currentDateTime.getMinutes()).slice(-2);

    // Formato del nombre de archivo: "Manual {nombre del archivo} - fechayhora.pdf"
    const downloadFileName = `${fileName} - ${formattedDateTime}.pdf`;

    // Usamos pdfjsLib para cargar el documento y generar un blob para la descarga
    pdfjsLib.getDocument(url).promise.then(function (pdf) {
        pdf.getData().then(function (data) {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = downloadFileName; // Usa el nombre dinámico del archivo
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        });
    });
}


// Open PDF modal
function openPDFModal() {
    const pdfIframe = document.getElementById('pdf-iframe');
    const pdfModal = document.getElementById('pdf-print-modal');
    pdfIframe.src = url;
    pdfModal.showModal();

    pdfIframe.onload = function () {
        pdfIframe.contentWindow.focus();
        pdfIframe.contentWindow.print();
    };
}

// Close PDF modal
function closePDFModal() {
    document.getElementById('pdf-print-modal').close();
}


function addNewButton() {
    const menu = document.getElementById('floating-menu');

    // Crear un nuevo botón
    const newButton = document.createElement('button');
    newButton.innerHTML = 'Nueva Opción';
    newButton.onclick = function () {
        alert('Nueva opción seleccionada');
        // Puedes agregar aquí cualquier funcionalidad adicional
    };

    // Agregar el botón al menú
    menu.appendChild(newButton);
}

// Llamar a la función para agregar el botón cuando se cargue la página
window.onload = function () {
   /* addNewButton();*/
};

async function downloadPDFWithHeaders() {
    // URL del PDF existente

    // Obtener el PDF como un array de bytes
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    // Cargar el PDF existente
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

    // Definir los membretes (pueden ser texto o imágenes)
    const headerText = 'Encabezado - Mi Empresa';
    const footerText = '{page}';
    const pageMembreteURL = '/Contenido/Membretes/membreteCarta.png'
    const pageImageBytes = await fetch(pageMembreteURL).then(res => res.arrayBuffer());
    const pageImage = await pdfDoc.embedPng(pageImageBytes); // O embedJpg si es JPG
    const pageDims = pageImage.scale(1);


    // Obtener el número total de páginas
    const totalPages = pdfDoc.getPageCount();
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    // Iterar sobre cada página y agregar los membretes
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();


        page.drawImage(pageImage, {
            x: 0,
            y: height - pageDims.height,
            width: pageDims.width,
            height: pageDims.height,
        });

        // Reemplazar {page} y {totalPages} en el texto del pie de página
        const footer = footerText.replace('{page}', (i + 1));
        const fontSize = 12;
        const textWidth = font.widthOfTextAtSize(footer, fontSize);
        const xPosition = (width - textWidth) / 2; // Centrado horizontalmente

        // Agregar el pie de página (membrete inferior)
        page.drawText(footer, {
            x: xPosition,
            y: 30, // Posición vertical 30 unidades desde la parte inferior
            size: fontSize,
            font: font, // Especifica la fuente
            color: PDFLib.rgb(0, 0, 0), // Color negro
        });
    }



    // Guardar el PDF modificado
    const pdfBytes = await pdfDoc.save();
    // Extrae el nombre del archivo desde la URL
    let fileName = url.split('/').pop(); // Toma la última parte del URL que es el nombre del archivo
    fileName = fileName.replace('.pdf', ''); // Remueve la extensión .pdf

    // Genera la fecha y hora en formato deseado: yyyyMMdd_HHmm
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.getFullYear() +
        ('0' + (currentDateTime.getMonth() + 1)).slice(-2) +
        ('0' + currentDateTime.getDate()).slice(-2) + '_' +
        ('0' + currentDateTime.getHours()).slice(-2) +
        ('0' + currentDateTime.getMinutes()).slice(-2);

    const downloadFileName = `${fileName} - ${formattedDateTime}.pdf`;

    // Crear un blob y descargar el PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
}


function comprobadorDescarga() {
    if (membretesPageDownload === true) {
        downloadPDFWithHeaders();
    } else 
    {
        downloadPDFPlaid();
    }
}

document.addEventListener('dragstart', function (event) {
    event.preventDefault();
});


 //Función para manejar la apertura y cierre de los diálogos (modales) y refrescar iframes
function manageModalBase(openBtnId, modalId, closeBtnId, iframeId = null, refreshBtnId = null) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    const iframe = iframeId ? document.getElementById(iframeId) : null;  // Verifica si hay iframe
    const refreshBtn = refreshBtnId ? document.getElementById(refreshBtnId) : null;  // Verifica si hay botón de refrescar

    if (openBtn && modal && closeBtn) {
        // Abrir el modal al hacer clic en el botón
        openBtn.addEventListener('click', () => {
            modal.showModal();
            document.body.classList.add('modal-open'); // Desactivar scroll del body
        });

        // Cerrar el modal al hacer clic en la "X"
        closeBtn.addEventListener('click', () => {
            modal.close();
            checkModalsOpenUno(); // Verificar si algún modal o menú flotante está abierto
        });

        // Refrescar el iframe al hacer clic en el botón de refrescar (si existe)
        if (refreshBtn && iframe) {
            refreshBtn.addEventListener('click', () => {
                iframe.src = iframe.src; // Recargar el iframe
            });
        }
    } else {
        console.warn(`Uno o más elementos faltan: ${openBtnId}, ${modalId}, ${closeBtnId}`);
    }
}

// Verificar si algún modal está abierto para controlar el scroll
function checkModalsOpenUno() {
    const modals = ['figmaModal', 'spreadsheetModal', 'contactCardDialog', 'serviceDeskModal', 'errorDialog', 'errorLogDialog'];
    const anyModalOpen = modals.some(id => document.getElementById(id)?.open);

    if (!anyModalOpen) {
        document.body.classList.remove('modal-open'); // Restaurar scroll del body
    }
}




function downloadFile(buttonElement) {
    // Obtiene la ruta del archivo desde el atributo personalizado
    const filePath = buttonElement.getAttribute('data-file-path');

    // Verifica si la ruta del archivo es válida
    if (filePath) {
        // Extrae el nombre del archivo de la ruta
        const fileName = filePath.split('/').pop();

        // Crea un enlace temporal para la descarga
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;

        // Simula el clic en el enlace para iniciar la descarga
        document.body.appendChild(link);
        link.click();

        // Elimina el enlace temporal
        document.body.removeChild(link);
    } else {
        console.error('Ruta del archivo no proporcionada.');
    }
}
const cierreMenuFlotante = () => {
    const menu = document.getElementById('floating-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    // Función para cerrar el menú cuando se presiona el botón "X"

        menu.style.display = 'none'; // Oculta el menú flotante
        document.body.classList.remove('modal-open'); // Restaurar el scroll del body
    
}


