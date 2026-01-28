/**
 * Script de inicialización para la exportación de PDF mejorada
 * Este script carga todos los componentes necesarios para la exportación de PDF
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de exportación de PDF mejorado');
    
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
            // Cargar estilos primero
            await cargarEstilos('/static/css/pdf-export-new.css');
            console.log('Estilos de exportación PDF cargados');
            
            // Cargar el script principal de exportación
            await cargarScript('/static/js/pdf-export-new.js');
            console.log('Script principal de exportación PDF cargado');
            
            // Cargar las mejoras de formato
            await cargarScript('/static/js/pdf-format-fixes.js');
            console.log('Mejoras de formato para PDF cargadas');
            
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
        const originalExtraerDatos = window.extraerDatos;
        if (originalExtraerDatos) {
            window.extraerDatos = function() {
                // Corregir fechas antes de extraer los datos
                corregirFechas();
                // Llamar a la función original
                return originalExtraerDatos();
            };
        }
        
        // Parche para mejorar la alineación de datos personales en el PDF
        const originalGenerarPDF = window.generarPDF;
        if (originalGenerarPDF) {
            window.generarPDF = async function() {
                // Aplicar mejoras antes de generar el PDF
                mejorarAlineacion();
                // Llamar a la función original
                await originalGenerarPDF();
            };
        }
    }
    
    // Función para corregir el formato de fechas
    function corregirFechas() {
        // Buscar todas las fechas en la sección de educación y cursos
        const seccionCursos = document.getElementById('cursos');
        if (!seccionCursos) return;
        
        // Corregir fechas en elementos de educación
        const periodoElements = seccionCursos.querySelectorAll('.card-info .card-value');
        periodoElements.forEach(element => {
            const texto = element.textContent;
            
            // Corregir formato de "Actualidad"
            if (texto.includes('Actualidad') && !texto.includes(' - Actualidad')) {
                element.textContent = texto.replace('Actualidad', ' - Actualidad');
            }
            
            // Asegurar que las fechas tengan el formato correcto
            if (texto.includes('-')) {
                const partes = texto.split('-');
                if (partes.length === 2) {
                    element.textContent = partes[0].trim() + ' - ' + partes[1].trim();
                }
            }
        });
        
        // Añadir etiqueta "Sobre mí:" a la descripción personal
        const descripcionElement = document.querySelector('#datos-personales .profile-section-content p');
        if (descripcionElement && !descripcionElement.textContent.toLowerCase().startsWith('sobre mí:')) {
            descripcionElement.textContent = 'Sobre mí: ' + descripcionElement.textContent;
        }
    }
    
    // Función para mejorar la alineación en el PDF
    function mejorarAlineacion() {
        // Esta función se ejecutará justo antes de generar el PDF
        console.log('Aplicando mejoras de alineación para el PDF');
        
        // Asegurar que la edad y nacionalidad estén alineadas correctamente
        const edadElement = document.querySelector('#datos-personales .profile-item:has(.profile-label:contains("Edad"))');
        const nacionalidadElement = document.querySelector('#datos-personales .profile-item:has(.profile-label:contains("Nacionalidad"))');
        
        if (edadElement) {
            edadElement.style.textAlign = 'right';
        }
        
        if (nacionalidadElement) {
            nacionalidadElement.style.textAlign = 'right';
        }
    }
    
    // Iniciar la carga de scripts
    inicializar();
});