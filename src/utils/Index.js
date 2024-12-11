function redirigir() {
    // Obtener el valor seleccionado del dropdown
    var dropdown = document.getElementById("opciones1");
    var selectedOption = dropdown.options[dropdown.selectedIndex].value;

    // Mapeo entre opciones y rutas
    var opcionesARutas = {

        "Controles volumétricos": "/ControlesVol/MenuControles",
        "SAP": "/SAP/MenuSap",
        "Desarrollo": "/Home/MenuDesarrollo",
        "Comunicaciones": "/Comunicaciones/MenuComunicaciones",
        "Soporte": "/Home/MenuSoporte",
        "Monitoreo": "/Home/MenuMonitoreo"
    };

    // Verificar si la opción seleccionada está en el mapeo
    if (opcionesARutas.hasOwnProperty(selectedOption)) {
        // Redirigir a la ruta correspondiente
        window.location.href = opcionesARutas[selectedOption];
    } else {
        // Redirigir a una vista por defecto o manejar caso no esperado
        // Puedes establecer una ruta por defecto o mostrar un mensaje de error
        window.location.href = "/Home/Index";
    }
}

function redirigirIndex() {
    // Puedes usar window.location.href para cambiar la URL y redirigir a otra vista.
    window.location.href = '/Home/Index';
}

function mostrarMensaje() {
    var selectedOption = $("#opciones1").val();
    obtenerMensajeDesdeServidor(selectedOption);
}

function obtenerMensajeDesdeServidor(opcion) {
    $.ajax({
        url: '/Home/ObtenerMensaje',
        type: 'POST',
        data: { opcion: opcion },
        success: function (data) {
            mostrarOcultarDiv(data.mensaje);
        },
        error: function (error) {
            console.log('Error al obtener el mensaje desde el servidor:', error);
        }
    });
}

function mostrarOcultarDiv(mensaje) {
    var mensajeTexto = $("#mensajeTexto");
    var miDiv = $("#miDiv");

    if (mensaje) {
        mensajeTexto.text(mensaje);
        miDiv.removeClass("oculto"); // Quitar la clase "oculto"
    } else {
        mensajeTexto.text("");
        miDiv.addClass("oculto"); // Agregar la clase "oculto"
    }
}
//slider
$(document).ready(function () {
    // Actualiza el contador al cambiar de diapositiva
    $('#carouselExample').on('slid.bs.carousel', function () {
        var currentIndex = $('#carouselExample .carousel-inner .carousel-item.active').index() + 1;
        var totalSlides = $('#carouselExample .carousel-inner .carousel-item').length;
        $('#counterBox').text(currentIndex + '/' + totalSlides);
    });

    // Inicializa el contador en la carga inicial
    $('#counterBox').text('1/'+$('#carouselExample .carousel-inner .carousel-item').length);
});

