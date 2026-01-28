/**
 * Mejoras en el formato del PDF para corregir problemas de alineación
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Añadir este script después de que se cargue pdf-export-new.js
    console.log('Cargando mejoras de formato para el PDF');
    
    // Sobrescribir la función extraerDatos para mejorar el formato
    const originalExtraerDatos = window.extraerDatos;
    window.extraerDatos = function() {
        // Aplicar correcciones de formato antes de extraer los datos
        corregirFormatoFechas();
        añadirEtiquetaSobreMi();
        
        // Llamar a la función original
        return originalExtraerDatos();
    };
    
    // Sobrescribir la función generarPDF para incluir la foto de perfil correctamente
    const originalGenerarPDF = window.generarPDF;
    window.generarPDF = async function() {
        // Llamar a la función original
        await originalGenerarPDF();
    };
});

/**
 * Corrige el formato de las fechas para evitar superposiciones
 */
function corregirFormatoFechas() {
    console.log('Corrigiendo formato de fechas');
    
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
}

/**
 * Añade la etiqueta "Sobre mí:" a la descripción personal si no existe
 */
function añadirEtiquetaSobreMi() {
    console.log('Añadiendo etiqueta "Sobre mí:" a la descripción personal');
    
    const descripcionElement = document.querySelector('#datos-personales .profile-section-content p');
    if (descripcionElement && !descripcionElement.textContent.toLowerCase().startsWith('sobre mí:')) {
        descripcionElement.textContent = 'Sobre mí: ' + descripcionElement.textContent;
    }
}