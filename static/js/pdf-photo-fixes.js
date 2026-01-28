/**
 * Mejoras para el formato de los datos personales y la foto de perfil
 */

// Función para mejorar la alineación de los datos personales
function mejorarAlineacionDatosPersonales() {
    // Sobrescribir la parte del código que genera los datos personales en el PDF
    const originalGenerarPDF = window.generarPDF;
    window.generarPDF = async function() {
        try {
            // Verificar que jsPDF esté disponible
            if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
                throw new Error('La biblioteca jsPDF no está disponible');
            }
            
            // Extraer datos de las secciones
            const datos = extraerDatos();
            
            // Mostrar mensaje de carga
            mostrarCargando('Generando PDF...');
            
            // Crear un nuevo documento PDF
            const doc = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Variables para el posicionamiento
            let y = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const contentWidth = pageWidth - 2 * margin;
            
            // Título del documento
            doc.setFontSize(22);
            doc.setTextColor(0, 71, 171); // Azul cobalto
            const titulo = datos.datosPersonales.nombre || 'Hoja de Vida';
            doc.text(titulo, margin, y);
            y += 10;
            
            // Subtítulo (ocupación)
            if (datos.datosPersonales.ocupacion) {
                doc.setFontSize(14);
                doc.setTextColor(80, 80, 80);
                doc.text(datos.datosPersonales.ocupacion, margin, y);
                y += 10;
            }
            
            // Línea separadora
            doc.setDrawColor(0, 71, 171); // Azul cobalto
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageWidth - margin, y);
            y += 10;
            
            // Datos Personales
            doc.setFontSize(16);
            doc.setTextColor(0, 71, 171); // Azul cobalto
            doc.text('Datos Personales', margin, y);
            y += 10;
            
            // Línea separadora
            doc.setDrawColor(0, 71, 171);
            doc.setLineWidth(0.5);
            doc.line(margin, y - 5, pageWidth - margin, y - 5);
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            
            // Intentar añadir la foto de perfil si existe
            if (datos.datosPersonales.fotoUrl) {
                try {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    
                    // Esperar a que la imagen se cargue
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = datos.datosPersonales.fotoUrl;
                    });
                    
                    // Crear un canvas para recortar la imagen en un cuadrado
                    const canvas = document.createElement('canvas');
                    const size = Math.min(img.width, img.height);
                    canvas.width = size;
                    canvas.height = size;
                    
                    const ctx = canvas.getContext('2d');
                    const offsetX = (img.width - size) / 2;
                    const offsetY = (img.height - size) / 2;
                    ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
                    
                    // Convertir a base64
                    const dataURL = canvas.toDataURL('image/jpeg');
                    
                    // Añadir la imagen al PDF
                    const fotoSize = 30; // 30mm x 30mm
                    const fotoX = pageWidth - margin - fotoSize;
                    const fotoY = y;
                    
                    doc.addImage(
                        dataURL,
                        'JPEG',
                        fotoX,
                        fotoY,
                        fotoSize,
                        fotoSize
                    );
                    
                    console.log('Foto de perfil añadida al PDF');
                } catch (error) {
                    console.error('Error al añadir la foto de perfil:', error);
                }
            }
            
            // Columna izquierda
            let yLeft = y;
            
            if (datos.datosPersonales.email) {
                doc.setFont("helvetica", "bold");
                doc.text('Email:', margin, yLeft);
                doc.setFont("helvetica", "normal");
                doc.text(datos.datosPersonales.email, margin + 25, yLeft);
                yLeft += 7;
            }
            
            if (datos.datosPersonales.teléfono) {
                doc.setFont("helvetica", "bold");
                doc.text('Teléfono:', margin, yLeft);
                doc.setFont("helvetica", "normal");
                doc.text(datos.datosPersonales.teléfono, margin + 25, yLeft);
                yLeft += 7;
            }
            
            if (datos.datosPersonales.dirección) {
                doc.setFont("helvetica", "bold");
                doc.text('Dirección:', margin, yLeft);
                doc.setFont("helvetica", "normal");
                
                // Dividir el texto en líneas para evitar que se superponga con la foto
                const maxWidth = contentWidth - 60; // Reducir el ancho para la foto
                const lines = doc.splitTextToSize(datos.datosPersonales.dirección, maxWidth);
                doc.text(lines, margin + 25, yLeft);
                yLeft += lines.length * 7;
            }
            
            // Columna derecha (alineada correctamente)
            const middleX = pageWidth / 2;
            let yRight = y;
            
            if (datos.datosPersonales.edad) {
                doc.setFont("helvetica", "bold");
                // Alinear a la derecha el texto "Edad:"
                const edadLabelWidth = doc.getTextWidth('Edad:');
                doc.text('Edad:', middleX, yRight);
                doc.setFont("helvetica", "normal");
                doc.text(datos.datosPersonales.edad, middleX + 25, yRight);
                yRight += 7;
            }
            
            if (datos.datosPersonales.nacionalidad) {
                doc.setFont("helvetica", "bold");
                // Alinear correctamente el texto "Nacionalidad:"
                doc.text('Nacionalidad:', middleX, yRight);
                doc.setFont("helvetica", "normal");
                doc.text(datos.datosPersonales.nacionalidad, middleX + 25, yRight);
                yRight += 7;
            }
            
            // Actualizar la posición Y al máximo de ambas columnas
            y = Math.max(yLeft, yRight) + 5;
            
            // Descripción personal
            if (datos.datosPersonales.descripcion) {
                doc.setFontSize(11);
                const lines = doc.splitTextToSize(datos.datosPersonales.descripcion, contentWidth);
                doc.text(lines, margin, y);
                y += lines.length * 7;
            }
            
            // Continuar con la generación del resto del PDF
            // ...
            
            // Guardar el PDF
            doc.save('hoja_de_vida.pdf');
            
            ocultarCargando();
            
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            ocultarCargando();
            alert('Error al generar el PDF: ' + error.message);
        }
    };
}

// Ejecutar la mejora cuando se cargue el documento
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que se cargue el script principal de exportación
    setTimeout(() => {
        mejorarAlineacionDatosPersonales();
        console.log('Mejoras para datos personales y foto de perfil aplicadas');
    }, 1000);
});