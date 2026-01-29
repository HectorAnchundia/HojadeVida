/**
 * Script para forzar la visualización del panel de exportación de PDF
 * Este script se ejecuta después de que la página se ha cargado completamente
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando forzado de panel de exportación PDF');
    
    // Verificar si estamos en la vista de garaje
    const isGarajePage = document.body.classList.contains('garaje-mode');
    
    // No mostrar el panel en la vista de garaje
    if (isGarajePage) {
        console.log('Vista de garaje detectada, no se mostrará el panel de exportación de PDF');
        return;
    }
    
    // Función para crear el panel de exportación si no existe
    function crearPanelExportacion() {
        console.log('Verificando existencia del panel de exportación');
        
        // Verificar si ya existe el panel
        let panelContainer = document.getElementById('pdf-export-panel-container');
        
        if (!panelContainer) {
            console.log('Creando panel de exportación desde cero');
            
            // Crear el contenedor principal
            panelContainer = document.createElement('div');
            panelContainer.id = 'pdf-export-panel-container';
            panelContainer.className = 'pdf-export-panel-container force-visible';
            
            // Crear la pestaña para mostrar/ocultar el panel
            const panelTab = document.createElement('div');
            panelTab.className = 'pdf-export-tab';
            panelTab.innerHTML = '<i class="fas fa-file-pdf"></i> Exportar PDF';
            
            // Crear el panel
            const panelExportacion = document.createElement('div');
            panelExportacion.id = 'pdf-export-panel';
            panelExportacion.className = 'pdf-export-panel';
            
            // Contenido HTML del panel
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
                        Educación
                    </label>
                </div>
                
                <div class="pdf-export-suboptions" id="pdf-education-options">
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" id="pdf-include-studies" checked>
                            <span class="pdf-checkbox"></span>
                            Formación Académica
                        </label>
                    </div>
                    
                    <div class="pdf-export-option">
                        <label class="pdf-checkbox-container">
                            <input type="checkbox" id="pdf-include-courses" checked>
                            <span class="pdf-checkbox"></span>
                            Cursos y Certificaciones
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
                
                <!-- Opción para incluir todas las imágenes (Cloudinary) -->
                <div class="pdf-export-option">
                    <label class="pdf-checkbox-container">
                        <input type="checkbox" id="pdf-include-all-images" checked>
                        <span class="pdf-checkbox"></span>
                        Incluir todas las imágenes
                    </label>
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
            console.log('Panel de exportación flotante creado');
            
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
            inicializarEventos();
        } else {
            console.log('Panel de exportación ya existe, asegurando visibilidad');
            panelContainer.classList.add('force-visible');
            
            // Asegurarse de que el panel esté visible
            setTimeout(() => {
                panelContainer.style.display = 'flex';
                panelContainer.style.opacity = '1';
                panelContainer.style.visibility = 'visible';
            }, 500);
        }
    }
    
    // Función para inicializar los eventos del panel
    function inicializarEventos() {
        console.log('Inicializando eventos del panel de exportación');
        
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
            
            // Cerrar el panel cuando se hace clic fuera de él
            document.addEventListener('click', function(event) {
                if (!panelContainer.contains(event.target) && 
                    panelContainer.classList.contains('active')) {
                    panelContainer.classList.remove('active');
                }
            });
            
            // Mantener el panel abierto cuando el mouse está sobre él
            panelContainer.addEventListener('mouseenter', function() {
                panelContainer.classList.add('active');
            });
            
            // Cerrar el panel cuando el mouse sale de él (con un pequeño retraso)
            panelContainer.addEventListener('mouseleave', function() {
                setTimeout(() => {
                    if (!panelContainer.matches(':hover')) {
                        panelContainer.classList.remove('active');
                    }
                }, 300);
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
                console.log('Botón de exportación clickeado');
                generarPDF();
            });
        }
    }
    
    // Función para generar el PDF
    function generarPDF() {
        console.log('Generando PDF');
        mostrarCargando();
        
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
    
    // Función para obtener el token CSRF
    function getCsrfToken() {
        const name = 'csrftoken';
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }
    
    // Función para mostrar el overlay de carga
    function mostrarCargando(mensaje = 'Generando PDF...') {
        const loadingOverlay = document.getElementById('pdf-loading-overlay');
        if (!loadingOverlay) return;
        
        const loadingText = loadingOverlay.querySelector('.pdf-loading-text');
        
        if (loadingText) {
            loadingText.textContent = mensaje;
        }
        
        loadingOverlay.classList.add('show');
    }
    
    // Función para ocultar el overlay de carga
    function ocultarCargando() {
        const loadingOverlay = document.getElementById('pdf-loading-overlay');
        if (!loadingOverlay) return;
        
        loadingOverlay.classList.remove('show');
    }
    
    // Intentar crear el panel después de que la página se haya cargado completamente
    setTimeout(crearPanelExportacion, 1000);
    
    // Exponer funciones para uso externo
    window.generarPDF = generarPDF;
    window.mostrarCargando = mostrarCargando;
    window.ocultarCargando = ocultarCargando;
});