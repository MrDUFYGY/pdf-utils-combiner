function manageModalWithIframe(openBtnId, modalId, closeBtnId, iframeId = null, refreshBtnId = null) {
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
            checkModalsOpen(); // Verificar si algún modal o menú flotante está abierto
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
function checkModalsOpen() {
    const modals = ['figmaModal', 'spreadsheetModal', 'contactCardDialog', 'serviceDeskModal', 'errorDialog', 'errorLogDialog'];
    const anyModalOpen = modals.some(id => document.getElementById(id)?.open);

    if (!anyModalOpen) {
        document.body.classList.remove('modal-open'); // Restaurar scroll del body
    }
}