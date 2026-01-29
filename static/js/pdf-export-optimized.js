/**
 * Script optimizado para el panel de exportación de PDF
 * Mantiene todas las opciones pero con mejor rendimiento
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
                
                <!-- Opciones principales -->
                <div class="pdf-export-option">
                    <label class="pdf-checkbox-container">
                        <input type="checkbox" id="pdf-include-personal" checked>
                        <span class="pdf-checkbox"></span>
                        Datos Personales
                    </label>
                </div>
                
                <div class="pdf-export-option">
                    <label class="pdf-checkbox-container">
                        <input type="checkbox" id="pdf-include-experience" checked>
                        <span class="pdf-checkbox"></span>
                        Experiencia Laboral
                    </label>
                </div>
                
                <div class="pdf-export-option">
                    <label class="pdf-checkbox-container">
                        <input type="checkbox" id="pdf-include-academic" checked>
                        <span class="pdf-checkbox"></span>
                        Productos Académicos
                    </label>
                </div>
                
                <div class="pdf-export-option">
                    <label class="pdf-checkbox-container">
                        <input type="checkbox" id="pdf-include-products" checked>
                        <span class="pdf-checkbox"></span>
                        Productos Laborales
                    </label>
                </div>
                
                <div class="pdf-export-option">
                    <label class="pdf-checkbox-container">
                        <input type="checkbox" id="pdf-include-education" checked>
                        <span class="pdf-checkbox"></span>
                        Cursos y Títulos
                    </label>
                </div>
                
                <div class="pdf-export-suboptions" id="pdf-education-options">
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" id="pdf-include-studies" checked>
                            <span class="pdf-checkbox"></span>
                            Estudios Realizados
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" id="pdf-include-courses" checked>
                            <span class="pdf-checkbox"></span>
                            Cursos Realizados
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" id="pdf-include-education-docs" checked>
                            <span class="pdf-checkbox"></span>
                            Incluir todos los documentos
                        </label>
                    </div>
                </div>
                
                <div class="pdf-export-option">
                    <label class="pdf-checkbox-container">
                        <input type="checkbox" id="pdf-include-recognition" checked>
                        <span class="pdf-checkbox"></span>
                        Reconocimientos
                    </label>
                </div>
                
                <div class="pdf-export-suboptions" id="pdf-recognition-options">
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" id="pdf-include-general-recognition" checked>
                            <span class="pdf-checkbox"></span>
                            Reconocimientos Generales
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" id="pdf-include-work-recognition" checked>
                            <span class="pdf-checkbox"></span>
                            Reconocimientos Laborales
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" id="pdf-include-recognition-docs" checked>
                            <span class="pdf-checkbox"></span>
                            Incluir todos los documentos
                        </label>
                    </div>
                </div>
                
                <!-- Botón de exportación -->
                <button id="pdf-export-button" class="pdf-export-button">
                    <i class="fas fa-file-pdf"></i> Generar PDF
                </button>
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
            
            // Inicializar eventos básicos
            initBasicEvents();
        }
    }, 1500); // Retraso de 1.5 segundos para no bloquear la carga inicial
    
    // Inicializar eventos básicos (versión optimizada)
    function initBasicEvents() {
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
        
        // Evento para el botón de exportación
        const exportButton = document.getElementById('pdf-export-button');
        if (exportButton) {
            exportButton.addEventListener('click', function() {
                generarPDF();
            });
        }
    }
    
    // Función optimizada para generar el PDF
    function generarPDF() {
        const loadingOverlay = document.getElementById('pdf-loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.add('show');
        
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
            includeRecognitionDocs: document.getElementById('pdf-include-recognition-docs')?.checked || false
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
            if (loadingOverlay) loadingOverlay.classList.remove('show');
        }, 1000);
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
});