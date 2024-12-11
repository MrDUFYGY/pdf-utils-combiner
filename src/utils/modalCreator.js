import { manageModalWithIframe } from './modalLogic.js'; // Importamos la función desde tu lógica

// Función para crear un modal dinámico con los parámetros recibidos
export const createModalWithParams = ({ openBtnId, modalId, closeBtnId, iframeId, refreshBtnId, iframeSrc, modalTitle, floatingMenuId }) => {
    // Obtener el menú flotante donde se añadirá tanto el botón como el modal
    const floatingMenu = document.getElementById(floatingMenuId);

    // Crear el botón que abre el modal
    const openButton = document.createElement('button');
    openButton.id = openBtnId;
    openButton.textContent = `Abrir ${modalTitle}`;

    // Añadir el botón al menú flotante
    floatingMenu.appendChild(openButton);

    // Crear el modal
    const modal = document.createElement('dialog');
    modal.id = modalId;

    // Crear la cabecera del modal
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    // Título del modal
    const title = document.createElement('h2');
    title.textContent = `Vista previa de ${modalTitle}`;
    modalHeader.appendChild(title);

    // Botones de navegación (Atrás y Adelante)
    const navButtons = document.createElement('div');
    navButtons.className = 'nav-buttons';

    // Botón "Atrás"
    const backButton = document.createElement('button');
    backButton.className = 'back-btn';
    backButton.textContent = '◀ Atrás';
    backButton.onclick = () => window.history.back(); // Navegación hacia atrás
    navButtons.appendChild(backButton);

    // Botón "Adelante"
    const forwardButton = document.createElement('button');
    forwardButton.className = 'forward-btn';
    forwardButton.textContent = 'Adelante ▶';
    forwardButton.onclick = () => window.history.forward(); // Navegación hacia adelante
    navButtons.appendChild(forwardButton);

    modalHeader.appendChild(navButtons);

    // Botón para abrir en una nueva ventana
    const openInNewTabButton = document.createElement('button');
    openInNewTabButton.className = 'outPage';
    openInNewTabButton.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 18C1.45 18 0.979333 17.8043 0.588 17.413C0.196667 17.0217 0.000666667 16.5507 0 16V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H9V2H2V16H16V9H18V16C18 16.55 17.8043 17.021 17.413 17.413C17.0217 17.805 16.5507 18.0007 16 18H2ZM6.7 12.7L5.3 11.3L14.6 2H11V0H18V7H16V3.4L6.7 12.7Z" fill="black" />
    </svg>`; // Icono SVG para el botón
    openInNewTabButton.onclick = () => window.open(iframeSrc, '_blank'); // Abre el enlace en una nueva pestaña
    modalHeader.appendChild(openInNewTabButton);

    // Botón de refrescar iframe
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh';
    refreshButton.id = refreshBtnId;

    // Usar innerHTML para agregar el SVG directamente al botón
    refreshButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 16C5.76667 16 3.875 15.225 2.325 13.675C0.775 12.125 0 10.2333 0 8C0 5.76667 0.775 3.875 2.325 2.325C3.875 0.775 5.76667 0 8 0C9.15 0 10.25 0.237333 11.3 0.712C12.35 1.18667 13.25 1.866 14 2.75V0H16V7H9V5H13.2C12.6667 4.06667 11.9377 3.33333 11.013 2.8C10.0883 2.26667 9.084 2 8 2C6.33333 2 4.91667 2.58333 3.75 3.75C2.58333 4.91667 2 6.33333 2 8C2 9.66667 2.58333 11.0833 3.75 12.25C4.91667 13.4167 6.33333 14 8 14C9.28333 14 10.4417 13.6333 11.475 12.9C12.5083 12.1667 13.2333 11.2 13.65 10H15.75C15.2833 11.7667 14.3333 13.2083 12.9 14.325C11.4667 15.4417 9.83333 16 8 16Z" fill="black"/>
    </svg>
`;

    // Agregar el botón al encabezado del modal
    modalHeader.appendChild(refreshButton);

    // Botón de cerrar
    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.id = closeBtnId;

    // Usar innerHTML para agregar el SVG directamente al botón de cerrar
    closeButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="black"/>
    </svg>
`;

    // Agregar el botón al encabezado del modal
    modalHeader.appendChild(closeButton);


    // Agregar la cabecera al modal
    modal.appendChild(modalHeader);

    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Crear el iframe
    const iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.style.border = '1px solid rgba(0, 0, 0, 0.1)';
    iframe.width = '100%';
    iframe.height = '450';
    iframe.src = iframeSrc; // Establecer la URL del iframe
    modalContent.appendChild(iframe);

    // Agregar el contenido al modal
    modal.appendChild(modalContent);

    // Agregar el modal al menú flotante
    floatingMenu.appendChild(modal);

    // Usar la lógica importada para manejar la apertura, cierre y refrescar iframe
    manageModalWithIframe({
        openBtnId,
        modalId,
        closeBtnId,
        iframeId,
        refreshBtnId
    });
};
