


async function loadPdfJs() {
    try {
        // Intentar cargar pdf.js desde el CDN
        const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.min.mjs');
        // Configurar el workerSrc para el CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.mjs';
        window.pdfjsLib = pdfjsLib; // Asignar pdfjsLib al contexto global
    } catch (error) {
        console.warn('No se pudo cargar pdf.js desde el CDN. Cargando la versión local...');

        try {
            // Obtener la URL del archivo en lugar de usar import directo
            const pdfMinUrl = '/pdfJS/pdf.min.mjs?url';
            const pdfWorkerUrl = '/pdfJS/pdf.worker.min.mjs';
        
            // Cargar dinámicamente desde la URL generada
            const pdfjsLibLocal = await import(/* @vite-ignore */ pdfMinUrl);
        
            // Configurar el workerSrc para la versión local
            pdfjsLibLocal.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        
            // Asignar pdfjsLib al contexto global
            window.pdfjsLib = pdfjsLibLocal;
        } catch (localError) {
            console.error('Error al cargar pdf.js desde la ruta local:', localError);
        }
    }

    // Una vez que pdf.js se ha cargado (ya sea desde el CDN o localmente), inicializar el visor PDF
    initializePDFViewer();
}
document.addEventListener('DOMContentLoaded', loadPdfJs);

function initializePDFViewer() {
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfGallery = document.getElementById('pdf-gallery');
    let pdfDoc = null;
    let currentPageNum = 1;
    let scale = 1;
    let thumbnailsArray = []; // Store thumbnails in the correct order


    // Load the PDF
    pdfjsLib.getDocument(url).promise.then(function (pdf) {
        pdfDoc = pdf;
        console.log('PDF loaded successfully');

        // Render the first page by default
        renderPage(currentPageNum, scale);

        // Generate thumbnails for all pages in order
        generateThumbnailsSequentially();

        // Set up page controls
        setPDFControls();
    });

    // Render the current page
    function renderPage(pageNum, scale) {
        pdfDoc.getPage(pageNum).then(function (page) {
            const viewport = page.getViewport({ scale });
            // Crear un contenedor para la página y el membrete
            const pageContainer = document.createElement('div');
            pageContainer.style.position = 'relative'; // Posición relativa para el membrete
            pageContainer.style.marginTop = '30px'; // Espaciado entre páginas

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;


            pageContainer.appendChild(footerDiv);
            pageContainer.appendChild(rightMarginDiv);
            pageContainer.appendChild(leftMarginDiv);
            pageContainer.appendChild(logoDiv);
            pageContainer.appendChild(membreteDiv);

        

            // Clear the viewer before rendering
            pdfViewer.innerHTML = '';
            pageContainer.appendChild(canvas);
            pdfViewer.appendChild(pageContainer); // Añadir el contenedor de la página y el membrete

            //pdfViewer.appendChild(canvas);

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext).promise.then(function () {
                console.log(`Page ${pageNum} rendered`);
            }).catch(function (error) {
                console.error('Error rendering page:', error);
            });
        });
    }

    // Generate thumbnails sequentially
    function generateThumbnailsSequentially() {
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            generateThumbnail(pageNum);
        }
    }

    // Generate thumbnail for each page
    function generateThumbnail(pageNum) {
        pdfDoc.getPage(pageNum).then(function (page) {
            const thumbScale = 0.3;
            const viewport = page.getViewport({ scale: thumbScale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext).promise.then(function () {
                const thumbnail = document.createElement('img');
                thumbnail.classList.add('pdf-thumbnail');
                thumbnail.src = canvas.toDataURL();
                thumbnail.addEventListener('click', () => {
                    currentPageNum = pageNum;
                    renderPage(currentPageNum, scale);
                });

                thumbnailsArray[pageNum - 1] = thumbnail;

                if (thumbnailsArray.length === pdfDoc.numPages) {
                    renderThumbnailsInOrder();
                }
            });
        }).catch(function (error) {
            console.error('Error generating thumbnail:', error);
        });
    }

    // Render thumbnails in order
    function renderThumbnailsInOrder() {
        pdfGallery.innerHTML = '';
        thumbnailsArray.forEach(thumbnail => {
            if (thumbnail) {
                pdfGallery.appendChild(thumbnail);
            }
        });
    }

    // Set up PDF controls
    function setPDFControls() {
        document.getElementById('go_previous').addEventListener('click', () => {
            if (currentPageNum > 1) {
                currentPageNum--;
                document.querySelectorAll('.current_page').forEach(input => input.value = currentPageNum);
                renderPage(currentPageNum, scale);
            }
        });

        document.getElementById('go_next').addEventListener('click', () => {
            if (currentPageNum < pdfDoc.numPages) {
                currentPageNum++;
                document.querySelectorAll('.current_page').forEach(input => input.value = currentPageNum);
                renderPage(currentPageNum, scale);
            }
        });

        document.querySelectorAll('.current_page').forEach(input => {
            input.addEventListener('change', (event) => {
                const pageNum = parseInt(event.target.value, 10);
                if (pageNum >= 1 && pageNum <= pdfDoc.numPages) {
                    currentPageNum = pageNum;
                    renderPage(currentPageNum, scale);
                }
            });
        });

        document.querySelectorAll('.zoom_in').forEach(button => {
            button.addEventListener('click', () => {
                scale += 0.1;
                renderPage(currentPageNum, scale);
            });
        });

        document.querySelectorAll('.zoom_out').forEach(button => {
            button.addEventListener('click', () => {
                scale = Math.max(scale - 0.1, 0.1);
                renderPage(currentPageNum, scale);
            });
        });
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case '+': // Zoom in con flecha arriba
                    scale += 0.1;
                    renderPage(currentPageNum, scale);
                    break;
                case '-': // Zoom out con flecha abajo
                    scale = Math.max(scale - 0.1, 0.1);
                    renderPage(currentPageNum, scale);
                    break;
                case 'ArrowRight': // Página siguiente con flecha derecha
                    if (currentPageNum < pdfDoc.numPages) {
                        currentPageNum++;
                        document.querySelectorAll('.current_page').forEach(input => input.value = currentPageNum);
                        renderPage(currentPageNum, scale);
                    }
                    break;
                case 'ArrowLeft': // Página anterior con flecha izquierda
                    if (currentPageNum > 1) {
                        currentPageNum--;
                        document.querySelectorAll('.current_page').forEach(input => input.value = currentPageNum);
                        renderPage(currentPageNum, scale);
                    }
                    break;
            }
        });
    }



    // Floating controls
    const floatingControls = document.querySelector('.floating-controls');
    floatingControls.classList.add('hide');

    window.addEventListener('scroll', function () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercent > 20) {
            floatingControls.classList.add('show');
            floatingControls.classList.remove('hide');
        } else {
            floatingControls.classList.add('hide');
            floatingControls.classList.remove('show');
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'm' || event.key === 'M') {
            const menu = document.getElementById('floating-menu');

            if (menu.style.display === 'block' || menu.style.display === '') {
                menu.style.display = 'none'; // oculta el menú flotante
                document.body.classList.remove('modal-open'); // Restaurar el scroll del body
                const dialogs = document.querySelectorAll('dialog');
                dialogs.forEach(dialog => {
                    dialog.close(); // Cierra cada dialog
                });
            } else {
                
                menu.style.display = 'block'; // Mostrar el menú flotante
                document.body.classList.remove('modal-open'); // Restaurar el scroll del body               
            }
        }
    });


};




