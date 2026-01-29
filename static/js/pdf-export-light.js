/**
 * Script optimizado para el panel de exportación de PDF
 * Versión ligera que reduce la carga en el navegador
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
            
            // Contenido HTML del panel (simplificado)
            panelExportacion.innerHTML = `
                <h5>Exportar a PDF</h5>
                
                <div class="pdf-export-option">
                    <label class="pdf-checkbox-container">
                        <input type="checkbox" id="pdf-include-all" checked>
                        <span class="pdf-checkbox"></span>
                        Incluir todo el contenido
                    </label>
                </div>
                
                <button id="pdf-export-button" class="pdf-export-button">
                    <i class="fas fa-file-pdf"></i> Generar PDF
                </button>
                
                <button id="pdf-options-button" class="pdf-options-button">
                    Mostrar opciones avanzadas
                </button>
            `;
            
            // Ensamblar el panel
            panelContainer.appendChild(panelTab);
            panelContainer.appendChild(panelExportacion);
            
            // Insertar el panel en el body
            document.body.appendChild(panelContainer);
            
            // Crear el overlay de carga (simplificado)
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
    }, 2000); // Retraso de 2 segundos para no bloquear la carga inicial
    
    // Inicializar eventos básicos (versión ligera)
    function initBasicEvents() {
        // Manejo del panel flotante
        const panelContainer = document.getElementById('pdf-export-panel-container');
        const panelTab = document.querySelector('.pdf-export-tab');
        
        if (panelTab && panelContainer) {
            // Hacer clic en la pestaña para mostrar/ocultar el panel
            panelTab.addEventListener('click', function() {
                panelContainer.classList.toggle('active');
            });
        }
        
        // Evento para el botón de exportación
        const exportButton = document.getElementById('pdf-export-button');
        if (exportButton) {
            exportButton.addEventListener('click', function() {
                generarPDFSimple();
            });
        }
        
        // Evento para el botón de opciones avanzadas
        const optionsButton = document.getElementById('pdf-options-button');
        if (optionsButton) {
            optionsButton.addEventListener('click', function() {
                window.location.href = '/export-options/';
            });
        }
    }
    
    // Función simplificada para generar PDF
    function generarPDFSimple() {
        const loadingOverlay = document.getElementById('pdf-loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.add('show');
        
        // Crear un formulario simple para enviar al servidor
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/generate-pdf/';
        form.target = '_blank';
        
        // Añadir el token CSRF
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfmiddlewaretoken';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
        
        // Añadir opción para incluir todo
        const includeAllInput = document.createElement('input');
        includeAllInput.type = 'hidden';
        includeAllInput.name = 'includeAll';
        includeAllInput.value = document.getElementById('pdf-include-all')?.checked || true;
        form.appendChild(includeAllInput);
        
        // Añadir el formulario al documento y enviarlo
        document.body.appendChild(form);
        form.submit();
        
        // Eliminar el formulario después de enviarlo
        setTimeout(() => {
            document.body.removeChild(form);
            if (loadingOverlay) loadingOverlay.classList.remove('show');
        }, 1000);
    }
});