/**
 * Integración de Cloudinary con la exportación de PDF
 * Este script maneja la descarga y preparación de imágenes de Cloudinary para incluirlas en el PDF
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando integración de Cloudinary con PDF');
    
    // Verificar si estamos en la vista de garaje
    const isGarajePage = document.body.classList.contains('garaje-mode');
    if (isGarajePage) {
        console.log('Vista de garaje detectada, no se inicializará la integración de Cloudinary con PDF');
        return;
    }
    
    // Reemplazar la función generarPDF original si existe
    if (typeof window.generarPDF === 'function') {
        const originalGenerarPDF = window.generarPDF;
        
        window.generarPDF = async function() {
            console.log('Preparando generación de PDF con soporte para Cloudinary');
            
            // Verificar si se deben incluir documentos
            const includeEducationDocs = document.getElementById('pdf-include-education-docs')?.checked || false;
            const includeRecognitionDocs = document.getElementById('pdf-include-recognition-docs')?.checked || false;
            
            // Si se deben incluir documentos, preparar las imágenes de Cloudinary
            if (includeEducationDocs || includeRecognitionDocs) {
                await prepararImagenesCloudinary(includeEducationDocs, includeRecognitionDocs);
            }
            
            // Llamar a la función original de generación de PDF
            return originalGenerarPDF();
        };
    } else {
        console.warn('No se encontró la función generarPDF para extender');
    }
    
    /**
     * Prepara las imágenes de Cloudinary para incluirlas en el PDF
     * @param {boolean} includeEducationDocs - Si se deben incluir documentos de educación
     * @param {boolean} includeRecognitionDocs - Si se deben incluir documentos de reconocimientos
     */
    async function prepararImagenesCloudinary(includeEducationDocs, includeRecognitionDocs) {
        console.log('Preparando imágenes de Cloudinary para PDF');
        mostrarCargando('Preparando imágenes para el PDF...');
        
        try {
            // Recopilar todas las URLs de Cloudinary que se deben incluir
            const urlsToInclude = [];
            
            // Recopilar URLs de documentos de educación si está activada la opción
            if (includeEducationDocs) {
                // Buscar enlaces a certificados en la sección de cursos
                const certificadoLinks = document.querySelectorAll('#cursos .certificate-container a');
                certificadoLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.includes('cloudinary.com')) {
                        // Limpiar la URL de Cloudinary (eliminar versión)
                        const cleanUrl = limpiarUrlCloudinary(href);
                        urlsToInclude.push({
                            url: cleanUrl,
                            tipo: 'certificado',
                            nombre: link.textContent.trim() || 'Certificado'
                        });
                    }
                });
                
                // Buscar enlaces a títulos en la sección de educación
                const tituloLinks = document.querySelectorAll('#cursos .education-item a');
                tituloLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.includes('cloudinary.com')) {
                        const cleanUrl = limpiarUrlCloudinary(href);
                        urlsToInclude.push({
                            url: cleanUrl,
                            tipo: 'titulo',
                            nombre: link.textContent.trim() || 'Título'
                        });
                    }
                });
            }
            
            // Recopilar URLs de documentos de reconocimientos si está activada la opción
            if (includeRecognitionDocs) {
                const reconocimientoLinks = document.querySelectorAll('#reconocimientos .recognition-item a');
                reconocimientoLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.includes('cloudinary.com')) {
                        const cleanUrl = limpiarUrlCloudinary(href);
                        urlsToInclude.push({
                            url: cleanUrl,
                            tipo: 'reconocimiento',
                            nombre: link.textContent.trim() || 'Reconocimiento'
                        });
                    }
                });
            }
            
            console.log(`Se encontraron ${urlsToInclude.length} documentos para incluir en el PDF`);
            
            // Si hay URLs para incluir, descargar las imágenes y prepararlas para el PDF
            if (urlsToInclude.length > 0) {
                // Crear un contenedor oculto para almacenar temporalmente las imágenes descargadas
                const tempContainer = document.createElement('div');
                tempContainer.id = 'pdf-cloudinary-temp-container';
                tempContainer.style.display = 'none';
                document.body.appendChild(tempContainer);
                
                // Descargar cada imagen y prepararla para el PDF
                for (let i = 0; i < urlsToInclude.length; i++) {
                    const item = urlsToInclude[i];
                    mostrarCargando(`Preparando documento ${i+1} de ${urlsToInclude.length}...`);
                    
                    try {
                        // Crear un elemento para la imagen
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'pdf-cloudinary-image';
                        imgContainer.dataset.tipo = item.tipo;
                        imgContainer.dataset.nombre = item.nombre;
                        
                        // Crear el elemento de imagen o iframe según el tipo
                        let element;
                        if (item.url.endsWith('.pdf')) {
                            // Para PDFs, usar un iframe
                            element = document.createElement('iframe');
                            element.src = item.url;
                            element.width = '100%';
                            element.height = '500px';
                        } else {
                            // Para imágenes, usar un elemento img
                            element = document.createElement('img');
                            element.src = item.url;
                            element.alt = item.nombre;
                            
                            // Esperar a que la imagen se cargue
                            await new Promise((resolve, reject) => {
                                element.onload = resolve;
                                element.onerror = reject;
                            });
                        }
                        
                        // Añadir el elemento al contenedor
                        imgContainer.appendChild(element);
                        tempContainer.appendChild(imgContainer);
                        
                        console.log(`Documento preparado: ${item.nombre} (${item.url})`);
                    } catch (error) {
                        console.error(`Error al preparar documento ${item.nombre}:`, error);
                    }
                }
                
                // Marcar que las imágenes están listas
                window.cloudinaryImagesReady = true;
            }
        } catch (error) {
            console.error('Error al preparar imágenes de Cloudinary:', error);
        } finally {
            ocultarCargando();
        }
    }
    
    /**
     * Limpia una URL de Cloudinary eliminando la parte de versión
     * @param {string} url - URL de Cloudinary a limpiar
     * @returns {string} URL limpia
     */
    function limpiarUrlCloudinary(url) {
        if (!url) return url;
        
        // Eliminar comillas que pudieran estar en la URL
        let cleanUrl = url.replace(/"/g, '');
        
        // Eliminar la parte de versión (v1234567890/)
        cleanUrl = cleanUrl.replace(/\/v\d+\//, '/');
        
        return cleanUrl;
    }
    
    /**
     * Genera el PDF utilizando el endpoint del servidor para manejar imágenes de Cloudinary
     */
    function generarPDFConServidor() {
        console.log('Generando PDF con soporte para Cloudinary a través del servidor');
        mostrarCargando('Generando PDF con el servidor...');
        
        // Obtener las opciones seleccionadas
        const opciones = {
            includePersonal: document.getElementById('pdf-include-personal')?.checked || false,
            includeExperience: document.getElementById('pdf-include-experience')?.checked || false,
            includeAcademic: document.getElementById('pdf-include-academic')?.checked || false,
            includeProducts: document.getElementById('pdf-include-products')?.checked || false,
            includeEducation: document.getElementById('pdf-include-education')?.checked || false,
            includeStudies: document.getElementById('pdf-include-studies')?.checked || false,
            includeCourses: document.getElementById('pdf-include-courses')?.checked || false,
            includeEducationDocs: document.getElementById('pdf-include-education-docs')?.checked || false,
            includeRecognition: document.getElementById('pdf-include-recognition')?.checked || false,
            includeGeneralRecognition: document.getElementById('pdf-include-general-recognition')?.checked || false,
            includeWorkRecognition: document.getElementById('pdf-include-work-recognition')?.checked || false,
            includeRecognitionDocs: document.getElementById('pdf-include-recognition-docs')?.checked || false,
            includeAllImages: document.getElementById('pdf-include-all-images')?.checked || false
        };
        
        // Crear un formulario para enviar las opciones al servidor
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/generate-pdf/';
        form.target = '_blank';  // Abrir en una nueva pestaña
        
        // Añadir el token CSRF
        const csrfToken = getCsrfToken();
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfmiddlewaretoken';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
        
        // Añadir las opciones como campos ocultos
        for (const [key, value] of Object.entries(opciones)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        }
        
        // Añadir el formulario al documento y enviarlo
        document.body.appendChild(form);
        form.submit();
        
        // Eliminar el formulario después de enviarlo
        setTimeout(() => {
            document.body.removeChild(form);
            ocultarCargando();
        }, 1000);
    }
    
    /**
     * Obtiene el token CSRF de las cookies
     */
    function getCsrfToken() {
        const name = 'csrftoken';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }
    
    // Exponer la función para uso externo
    window.generarPDFConServidor = generarPDFConServidor;
});