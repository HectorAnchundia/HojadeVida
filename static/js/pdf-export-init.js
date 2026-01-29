/**
 * Script de inicialización para la exportación de PDF mejorada
 * Este script carga todos los componentes necesarios para la exportación de PDF
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de exportación de PDF mejorado');
    
    // Verificar si estamos en la vista de garaje
    const isGarajePage = document.body.classList.contains('garaje-mode');
    
    // No inicializar el sistema de exportación en la vista de garaje
    if (isGarajePage) {
        console.log('Vista de garaje detectada, no se inicializará el sistema de exportación de PDF');
        return;
    }
    
    // Función para cargar scripts dinámicamente
    function cargarScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Función para cargar estilos dinámicamente
    function cargarEstilos(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    
    // Cargar los scripts y estilos necesarios
    async function inicializar() {
        try {
            // Cargar estilos primero (ya incluidos en base.html)
            console.log('Estilos de exportación PDF cargados');
            
            // Cargar el script principal de exportación
            await cargarScript('/static/js/pdf-export-new.js');
            console.log('Script principal de exportación PDF cargado');
            
            // Cargar las mejoras de formato
            await cargarScript('/static/js/pdf-format-fixes.js');
            console.log('Mejoras de formato para PDF cargadas');
            
            // Cargar la integración con Cloudinary
            await cargarScript('/static/js/cloudinary-pdf-integration.js');
            console.log('Integración con Cloudinary para PDF cargada');
            
            // Aplicar parches específicos para corregir problemas de alineación
            aplicarParches();
            
            console.log('Sistema de exportación de PDF inicializado correctamente');
        } catch (error) {
            console.error('Error al cargar los scripts de exportación PDF:', error);
        }
    }
    
    // Aplicar parches específicos para corregir problemas
    function aplicarParches() {
        // Parche para corregir el formato de fechas
        setTimeout(function() {
            if (typeof window.corregirFormatoFechas === 'function') {
                window.corregirFormatoFechas();
            }
            
            // Parche para mejorar la alineación de datos personales en el PDF
            if (typeof window.mejorarAlineacionDatosPersonales === 'function') {
                window.mejorarAlineacionDatosPersonales();
            }
            
            // Asegurarse de que el panel de exportación sea visible
            const panelContainer = document.getElementById('pdf-export-panel-container');
            if (panelContainer) {
                // Asegurarse de que el panel esté visible
                panelContainer.style.display = 'block';
                
                // Añadir una clase para hacer que el panel sea más visible
                panelContainer.classList.add('force-visible');
                
                console.log('Panel de exportación PDF configurado para ser visible');
            } else {
                console.warn('No se encontró el panel de exportación PDF');
            }
        }, 1000);
    }
    
    // Iniciar la carga de scripts
    inicializar();
});