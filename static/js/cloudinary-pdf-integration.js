/**
 * Integración de Cloudinary con el sistema de exportación de PDF existente
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando integración de Cloudinary con exportación de PDF');
    
    // Sobrescribir la función cargarImagen para manejar URLs de Cloudinary
    if (typeof window.cargarImagen === 'function') {
        const originalCargarImagen = window.cargarImagen;
        
        window.cargarImagen = function(url) {
            console.log('Cargando imagen con soporte para Cloudinary:', url);
            
            // Verificar si es una URL de Cloudinary
            if (url && url.includes('res.cloudinary.com')) {
                return new Promise((resolve, reject) => {
                    // Para URLs de Cloudinary, usamos un enfoque diferente para evitar problemas CORS
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    
                    // Modificar la URL para optimizar la imagen para PDF
                    // Añadimos parámetros de transformación para asegurar que la imagen sea de calidad adecuada
                    let optimizedUrl = url;
                    if (!url.includes('/q_auto/')) {
                        // Insertar parámetros de calidad y formato antes de /upload/
                        optimizedUrl = url.replace('/upload/', '/upload/q_auto,f_auto/');
                    }
                    
                    console.log('URL optimizada para Cloudinary:', optimizedUrl);
                    
                    img.onload = function() {
                        console.log('Imagen de Cloudinary cargada correctamente:', img.width, 'x', img.height);
                        
                        // Crear un canvas para convertir la imagen a base64
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        // Convertir a base64 con la mejor calidad
                        const dataURL = canvas.toDataURL('image/jpeg', 0.95);
                        
                        resolve({
                            dataURL: dataURL,
                            width: img.width,
                            height: img.height
                        });
                    };
                    
                    img.onerror = function(e) {
                        console.error('Error al cargar la imagen de Cloudinary:', optimizedUrl, e);
                        
                        // Intentar con la URL original como fallback
                        img.src = url;
                        
                        // Si también falla, rechazar la promesa
                        img.onerror = function() {
                            reject(new Error('No se pudo cargar la imagen desde Cloudinary'));
                        };
                    };
                    
                    // Cargar la imagen optimizada
                    img.src = optimizedUrl;
                });
            } else {
                // Para otras URLs, usar la función original
                return originalCargarImagen(url);
            }
        };
        
        console.log('Función cargarImagen sobrescrita con soporte para Cloudinary');
    } else {
        console.warn('No se encontró la función cargarImagen para sobrescribir');
    }
    
    // Integrar con el botón de exportación de PDF si existe
    const exportButton = document.getElementById('pdf-export-button');
    if (exportButton) {
        console.log('Botón de exportación de PDF encontrado, añadiendo soporte para Cloudinary');
        
        // Mantener la referencia al evento de clic original
        const originalClickHandlers = [...exportButton._events?.click || []];
        
        // Limpiar los eventos existentes
        exportButton.replaceWith(exportButton.cloneNode(true));
        
        // Obtener la nueva referencia al botón
        const newExportButton = document.getElementById('pdf-export-button');
        
        // Añadir el nuevo manejador de eventos
        newExportButton.addEventListener('click', function() {
            console.log('Iniciando exportación de PDF con soporte para Cloudinary');
            
            // Verificar si se debe usar el endpoint del servidor
            const useServerEndpoint = document.getElementById('pdf-include-all-images')?.checked || 
                                     document.getElementById('pdf-include-recognition-docs')?.checked ||
                                     document.getElementById('pdf-include-education-docs')?.checked;
            
            if (useServerEndpoint) {
                // Usar el endpoint del servidor para generar el PDF
                generarPDFConServidor();
            } else {
                // Restaurar los manejadores de eventos originales
                originalClickHandlers.forEach(handler => {
                    if (typeof handler === 'function') {
                        handler.call(this);
                    }
                });
            }
        });
    }
});

/**
 * Genera el PDF utilizando el endpoint del servidor para manejar imágenes de Cloudinary
 */
function generarPDFConServidor() {
    console.log('Generando PDF con el endpoint del servidor');
    
    // Mostrar indicador de carga
    if (typeof mostrarCargando === 'function') {
        mostrarCargando('Preparando documentos para el PDF...');
    }
    
    try {
        // Recopilar opciones seleccionadas
        const opciones = {
            sections: {
                datosPersonales: document.getElementById('pdf-include-personal')?.checked || true,
                experiencia: document.getElementById('pdf-include-experience')?.checked || true,
                productosAcademicos: document.getElementById('pdf-include-academic')?.checked || true,
                productosLaborales: document.getElementById('pdf-include-products')?.checked || true,
                educacion: document.getElementById('pdf-include-education')?.checked || true,
                cursos: document.getElementById('pdf-include-courses')?.checked || true,
                reconocimientos: document.getElementById('pdf-include-recognition')?.checked || true,
                include_images: document.getElementById('pdf-include-all-images')?.checked || false,
                include_certificates: document.getElementById('pdf-include-education-docs')?.checked || 
                                     document.getElementById('pdf-include-recognition-docs')?.checked || false
            }
        };
        
        // Enviar la solicitud al servidor
        fetch('/generate-pdf/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify(opciones)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            }
            return response.blob();
        })
        .then(blob => {
            // Crear un enlace para descargar el PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'hoja_de_vida.pdf';
            
            // Añadir al DOM y hacer clic
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            if (typeof ocultarCargando === 'function') {
                ocultarCargando();
            }
            
            // Ocultar el panel después de generar el PDF
            const panelContainer = document.getElementById('pdf-export-panel-container');
            if (panelContainer) {
                panelContainer.classList.remove('active');
            }
        })
        .catch(error => {
            console.error('Error al generar el PDF:', error);
            
            if (typeof ocultarCargando === 'function') {
                ocultarCargando();
            }
            
            alert('Error al generar el PDF: ' + error.message);
        });
    } catch (error) {
        console.error('Error al preparar la solicitud de PDF:', error);
        
        if (typeof ocultarCargando === 'function') {
            ocultarCargando();
        }
        
        alert('Error al generar el PDF: ' + error.message);
    }
}

/**
 * Obtiene el token CSRF de las cookies
 */
function getCsrfToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 'csrftoken='.length) === 'csrftoken=') {
                cookieValue = decodeURIComponent(cookie.substring('csrftoken='.length));
                break;
            }
        }
    }
    return cookieValue;
}