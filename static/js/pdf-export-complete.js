/**
 * Sistema completo de exportación de PDF para Hoja de Vida
 * Versión final con todas las correcciones y optimizaciones
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la vista de garaje
    const isGarajePage = document.body.classList.contains('garaje-mode');
    
    // No mostrar el panel en la vista de garaje
    if (isGarajePage) {
        return;
    }
    
    // Crear el panel después de un breve retraso para no bloquear el renderizado inicial
    setTimeout(function() {
        // Verificar si ya existe el panel
        let panelContainer = document.getElementById('pdf-export-panel-container');
        
        if (!panelContainer) {
            // Crear el contenedor principal
            panelContainer = document.createElement('div');
            panelContainer.id = 'pdf-export-panel-container';
            panelContainer.className = 'pdf-export-panel-container';
            
            // Crear la pestaña para mostrar/ocultar el panel
            const panelTab = document.createElement('div');
            panelTab.className = 'pdf-export-tab';
            panelTab.innerHTML = '<i class="fas fa-file-pdf"></i> Exportar PDF';
            
            // Crear el panel
            const panelExportacion = document.createElement('div');
            panelExportacion.id = 'pdf-export-panel';
            panelExportacion.className = 'pdf-export-panel';
            
            // Contenido HTML del panel con todas las opciones
            panelExportacion.innerHTML = `
                <h5>Exportar a PDF</h5>
                
                <form id="pdf-export-form" method="post" action="/generate-pdf/" target="_blank">
                    <!-- Campo oculto para el token CSRF -->
                    <input type="hidden" name="csrfmiddlewaretoken" value="${getCsrfToken()}">
                    
                    <!-- Opciones principales -->
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" name="includePersonal" id="pdf-include-personal" value="true" checked>
                            <span class="pdf-checkbox"></span>
                            Datos Personales
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" name="includeExperience" id="pdf-include-experience" value="true" checked>
                            <span class="pdf-checkbox"></span>
                            Experiencia Laboral
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" name="includeAcademic" id="pdf-include-academic" value="true" checked>
                            <span class="pdf-checkbox"></span>
                            Productos Académicos
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" name="includeProducts" id="pdf-include-products" value="true" checked>
                            <span class="pdf-checkbox"></span>
                            Productos Laborales
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" name="includeEducation" id="pdf-include-education" value="true" checked>
                            <span class="pdf-checkbox"></span>
                            Cursos y Títulos
                        </label>
                    </div>
                    
                    <div class="pdf-export-suboptions" id="pdf-education-options">
                        <div class="pdf-export-option">
                            <label class="pdf-checkbox-container">
                                <input type="checkbox" name="includeStudies" id="pdf-include-studies" value="true" checked>
                                <span class="pdf-checkbox"></span>
                                Estudios Realizados
                            </label>
                        </div>
                        
                        <div class="pdf-export-option">
                            <label class="pdf-checkbox-container">
                                <input type="checkbox" name="includeCourses" id="pdf-include-courses" value="true" checked>
                                <span class="pdf-checkbox"></span>
                                Cursos Realizados
                            </label>
                        </div>
                        
                        <div class="pdf-export-option">
                            <label class="pdf-checkbox-container">
                                <input type="checkbox" name="includeEducationDocs" id="pdf-include-education-docs" value="true" checked>
                                <span class="pdf-checkbox"></span>
                                Incluir todos los documentos
                            </label>
                        </div>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" name="includeRecognition" id="pdf-include-recognition" value="true" checked>
                            <span class="pdf-checkbox"></span>
                            Reconocimientos
                        </label>
                    </div>
                    
                    <div class="pdf-export-suboptions" id="pdf-recognition-options">
                        <div class="pdf-export-option">
                            <label class="pdf-checkbox-container">
                                <input type="checkbox" name="includeGeneralRecognition" id="pdf-include-general-recognition" value="true" checked>
                                <span class="pdf-checkbox"></span>
                                Reconocimientos Generales
                            </label>
                        </div>
                        
                        <div class="pdf-export-option">
                            <label class="pdf-checkbox-container">
                                <input type="checkbox" name="includeWorkRecognition" id="pdf-include-work-recognition" value="true" checked>
                                <span class="pdf-checkbox"></span>
                                Reconocimientos Laborales
                            </label>
                        </div>
                        
                        <div class="pdf-export-option">
                            <label class="pdf-checkbox-container">
                                <input type="checkbox" name="includeRecognitionDocs" id="pdf-include-recognition-docs" value="true" checked>
                                <span class="pdf-checkbox"></span>
                                Incluir todos los documentos
                            </label>
                        </div>
                    </div>
                    
                    <!-- Opción para incluir todas las imágenes (Cloudinary) -->
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" name="includeAllImages" id="pdf-include-all-images" value="true" checked>
                            <span class="pdf-checkbox"></span>
                            Incluir todas las imágenes
                        </label>
                    </div>
                    
                    <!-- Botón de exportación -->
                    <button type="submit" id="pdf-export-button" class="pdf-export-button">
                        <i class="fas fa-file-pdf"></i> Generar PDF
                    </button>
                </form>
            `;
            
            // Ensamblar el panel
            panelContainer.appendChild(panelTab);
            panelContainer.appendChild(panelExportacion);
            
            // Insertar el panel en el body
            document.body.appendChild(panelContainer);
            
            // Crear el overlay de carga
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'pdf-loading-overlay';
            loadingOverlay.className = 'pdf-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="pdf-loading-content">
                    <div class="pdf-loading-spinner"></div>
                    <p class="pdf-loading-text">Generando PDF...</p>
                </div>
            `;
            
            // Insertar el overlay en el body
            document.body.appendChild(loadingOverlay);
            
            // Inicializar eventos
            initEvents();
        }
    }, 1000); // Retraso de 1 segundo para no bloquear la carga inicial
    
    // Inicializar eventos
    function initEvents() {
        // Manejo del panel flotante
        const panelContainer = document.getElementById('pdf-export-panel-container');
        const panelTab = document.querySelector('.pdf-export-tab');
        
        if (panelTab && panelContainer) {
            // Hacer clic en la pestaña para mostrar/ocultar el panel
            panelTab.addEventListener('click', function() {
                panelContainer.classList.toggle('active');
            });
            
            // Mostrar el panel al pasar el mouse sobre la pestaña
            panelTab.addEventListener('mouseenter', function() {
                panelContainer.classList.add('active');
            });
        }
        
        // Mostrar/ocultar opciones de educación
        const includeEducation = document.getElementById('pdf-include-education');
        const educationOptions = document.getElementById('pdf-education-options');
        
        if (includeEducation && educationOptions) {
            includeEducation.addEventListener('change', function() {
                educationOptions.classList.toggle('show', this.checked);
            });
            
            // Mostrar inicialmente si está marcado
            if (includeEducation.checked) {
                educationOptions.classList.add('show');
            }
        }
        
        // Mostrar/ocultar opciones de reconocimientos
        const includeRecognition = document.getElementById('pdf-include-recognition');
        const recognitionOptions = document.getElementById('pdf-recognition-options');
        
        if (includeRecognition && recognitionOptions) {
            includeRecognition.addEventListener('change', function() {
                recognitionOptions.classList.toggle('show', this.checked);
            });
            
            // Mostrar inicialmente si está marcado
            if (includeRecognition.checked) {
                recognitionOptions.classList.add('show');
            }
        }
        
        // Manejar el envío del formulario
        const exportForm = document.getElementById('pdf-export-form');
        if (exportForm) {
            exportForm.addEventListener('submit', function(e) {
                // Mostrar overlay de carga
                const loadingOverlay = document.getElementById('pdf-loading-overlay');
                if (loadingOverlay) loadingOverlay.classList.add('show');
                
                // Preparar imágenes de Cloudinary si es necesario
                const includeEducationDocs = document.getElementById('pdf-include-education-docs')?.checked || false;
                const includeRecognitionDocs = document.getElementById('pdf-include-recognition-docs')?.checked || false;
                
                if ((includeEducationDocs || includeRecognitionDocs) && typeof prepararImagenesCloudinary === 'function') {
                    try {
                        prepararImagenesCloudinary(includeEducationDocs, includeRecognitionDocs);
                    } catch (error) {
                        console.error('Error al preparar imágenes de Cloudinary:', error);
                    }
                }
                
                // Ocultar el overlay después de un tiempo
                setTimeout(() => {
                    if (loadingOverlay) loadingOverlay.classList.remove('show');
                }, 3000);
            });
        }
    }
    
    // Función para obtener el token CSRF
    function getCsrfToken() {
        // Buscar en las cookies
        const name = 'csrftoken';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        
        // Si no está en las cookies, buscar en los elementos meta
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) return metaTag.getAttribute('content');
        
        // Si no se encuentra, buscar en los inputs ocultos
        const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
        if (csrfInput) return csrfInput.value;
        
        return '';
    }
    
    // Función para mostrar el overlay de carga
    window.mostrarCargando = function(mensaje = 'Generando PDF...') {
        const loadingOverlay = document.getElementById('pdf-loading-overlay');
        if (!loadingOverlay) return;
        
        const loadingText = loadingOverlay.querySelector('.pdf-loading-text');
        
        if (loadingText) {
            loadingText.textContent = mensaje;
        }
        
        loadingOverlay.classList.add('show');
    };
    
    // Función para ocultar el overlay de carga
    window.ocultarCargando = function() {
        const loadingOverlay = document.getElementById('pdf-loading-overlay');
        if (!loadingOverlay) return;
        
        loadingOverlay.classList.remove('show');
    };
    
    // Función para preparar imágenes de Cloudinary (simplificada)
    window.prepararImagenesCloudinary = function(includeEducationDocs, includeRecognitionDocs) {
        console.log('Preparando imágenes de Cloudinary para PDF');
        
        // Recopilar todas las URLs de Cloudinary que se deben incluir
        const urlsToInclude = [];
        
        // Recopilar URLs de documentos de educación si está activada la opción
        if (includeEducationDocs) {
            // Buscar enlaces a certificados en la sección de cursos
            const certificadoLinks = document.querySelectorAll('#cursos .certificate-container a');
            certificadoLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes('cloudinary.com')) {
                    urlsToInclude.push({
                        url: href,
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
                    urlsToInclude.push({
                        url: href,
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
                    urlsToInclude.push({
                        url: href,
                        tipo: 'reconocimiento',
                        nombre: link.textContent.trim() || 'Reconocimiento'
                    });
                }
            });
        }
        
        console.log(`Se encontraron ${urlsToInclude.length} documentos para incluir en el PDF`);
        return urlsToInclude;
    };
});