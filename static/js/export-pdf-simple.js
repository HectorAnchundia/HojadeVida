// Función simplificada para generar y descargar PDF
async function generarPDFDirecto(options, incluirDocumentos = false) {
    console.log("Iniciando generación de PDF con opciones:", options);
    
    // Mostrar indicador de carga
    mostrarCargando('Generando PDF...');

    try {
        // Crear un nuevo documento PDF
        const doc = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Configurar fuentes
        doc.setFont("helvetica", "normal");
        
        // Variables para el posicionamiento
        let y = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        
        // Función para agregar texto con salto de línea automático
        function addWrappedText(text, x, y, maxWidth, lineHeight = 7) {
            if (!text) return y;
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            return y + lines.length * lineHeight;
        }
        
        // Título del documento
        doc.setFontSize(22);
        doc.setTextColor(0, 71, 171); // Azul cobalto
        doc.text('Hoja de Vida', margin, y);
        y += 15;
        
        // Línea separadora
        doc.setDrawColor(0, 71, 171); // Azul cobalto
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
        
        // Datos Personales (simplificado)
        doc.setFontSize(16);
        doc.setTextColor(0, 71, 171); // Azul cobalto
        doc.text('Datos Personales', margin, y);
        y += 8;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('Este es un PDF de prueba para verificar la funcionalidad de descarga.', margin, y);
        y += 10;
        
        // Pie de página
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        const fechaGeneracion = `Hoja de vida generada el ${new Date().toLocaleDateString()}`;
        doc.text(fechaGeneracion, margin, doc.internal.pageSize.getHeight() - 10);
        
        console.log("PDF generado correctamente, preparando para descarga");
        
        // Generar el PDF como blob
        const pdfBlob = doc.output('blob');
        console.log("PDF blob creado:", pdfBlob);
        
        // Ocultar indicador de carga
        ocultarCargando();
        
        // Crear un enlace para descargar el PDF y forzar el clic
        const url = URL.createObjectURL(pdfBlob);
        console.log("URL del blob creada:", url);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hoja_de_vida_test.pdf';
        a.style.display = 'none';
        document.body.appendChild(a);
        
        console.log("Elemento <a> creado, intentando descargar...");
        a.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("Limpieza completada");
        }, 100);
        
        console.log("Proceso de descarga iniciado");
        
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        ocultarCargando();
        mostrarError('Error al generar el PDF: ' + error.message);
    }
}

// Función para mostrar indicador de carga
function mostrarCargando(mensaje) {
    console.log("Mostrando indicador de carga:", mensaje);
    const loadingElement = document.getElementById('loading-indicator');
    if (!loadingElement) {
        // Crear el elemento si no existe
        const loading = document.createElement('div');
        loading.id = 'loading-indicator';
        loading.className = 'loading-overlay';
        loading.style.position = 'fixed';
        loading.style.top = '0';
        loading.style.left = '0';
        loading.style.width = '100%';
        loading.style.height = '100%';
        loading.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loading.style.display = 'flex';
        loading.style.justifyContent = 'center';
        loading.style.alignItems = 'center';
        loading.style.zIndex = '9999';
        
        loading.innerHTML = `
            <div style="background-color: white; padding: 20px; border-radius: 5px; text-align: center;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p id="loading-message" style="margin-top: 10px;">${mensaje || 'Procesando...'}</p>
            </div>
        `;
        document.body.appendChild(loading);
    } else {
        // Actualizar el mensaje si ya existe
        const messageElement = document.getElementById('loading-message');
        if (messageElement) {
            messageElement.textContent = mensaje || 'Procesando...';
        }
        loadingElement.style.display = 'flex';
    }
}

// Función para ocultar indicador de carga
function ocultarCargando() {
    console.log("Ocultando indicador de carga");
    const loadingElement = document.getElementById('loading-indicator');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Función para mostrar mensaje de error
function mostrarError(mensaje) {
    console.error("Error:", mensaje);
    alert("Error: " + mensaje);
}