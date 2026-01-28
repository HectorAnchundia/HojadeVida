/**
 * Sistema avanzado de exportación de PDF para Hoja de Vida
 * Este archivo maneja toda la lógica de generación y descarga de PDF
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema avanzado de exportación de PDF');
    
    // Crear el panel de exportación de PDF
    crearPanelExportacion();
    
    // Inicializar los eventos para el panel
    inicializarEventos();
});

/**
 * Crea el panel de exportación de PDF y lo inserta en el DOM
 */
function crearPanelExportacion() {
    console.log('Creando panel de exportación de PDF');
    
    // Crear el contenedor principal
    const panelContainer = document.createElement('div');
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
        
        <!-- Estudios y Cursos -->
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
        
        <!-- Reconocimientos -->
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
}

/**
 * Inicializa los eventos para el panel de exportación
 */
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

/**
 * Muestra el overlay de carga
 */
function mostrarCargando(mensaje = 'Generando PDF...') {
    const loadingOverlay = document.getElementById('pdf-loading-overlay');
    const loadingText = loadingOverlay.querySelector('.pdf-loading-text');
    
    if (loadingText) {
        loadingText.textContent = mensaje;
    }
    
    loadingOverlay.classList.add('show');
}

/**
 * Oculta el overlay de carga
 */
function ocultarCargando() {
    const loadingOverlay = document.getElementById('pdf-loading-overlay');
    loadingOverlay.classList.remove('show');
}

/**
 * Extrae los datos de las secciones de la página
 */
function extraerDatos() {
    console.log('Extrayendo datos de las secciones');
    
    // Hacer que todas las secciones sean temporalmente visibles para poder extraer sus datos
    const sections = document.querySelectorAll('.section');
    const originalDisplayStyles = [];
    
    sections.forEach(section => {
        // Guardar el estilo original
        originalDisplayStyles.push({
            element: section,
            style: section.style.display
        });
        
        // Hacer la sección visible temporalmente
        section.style.display = 'block';
    });
    
    const datos = {
        datosPersonales: {},
        experienciaLaboral: [],
        productosAcademicos: [],
        productosLaborales: [],
        estudios: [],
        cursos: [],
        reconocimientosGenerales: [],
        reconocimientosLaborales: [],
        documentos: {
            estudios: [],
            cursos: [],
            reconocimientosGenerales: [],
            reconocimientosLaborales: []
        }
    };
    
    try {
        // Extraer datos personales
        const seccionDatosPersonales = document.getElementById('datos-personales');
        if (seccionDatosPersonales) {
            console.log('Extrayendo datos personales de:', seccionDatosPersonales);
            
            // Nombre y ocupación
            const nombre = document.querySelector('.profile-name')?.textContent.trim();
            const ocupacion = document.querySelector('.profile-title')?.textContent.trim();
            
            datos.datosPersonales.nombre = nombre || '';
            datos.datosPersonales.ocupacion = ocupacion || '';
            
            // Foto de perfil
            const fotoPerfil = document.querySelector('.profile-image');
            if (fotoPerfil && fotoPerfil.tagName === 'IMG') {
                datos.datosPersonales.fotoUrl = fotoPerfil.src;
            }
            
            // Descripción
            const descripcion = seccionDatosPersonales.querySelector('.profile-section-content p')?.textContent.trim();
            datos.datosPersonales.descripcion = descripcion || '';
            
            // Datos de contacto y personales
            const datosItems = seccionDatosPersonales.querySelectorAll('.profile-item');
            datosItems.forEach(item => {
                const label = item.querySelector('.profile-label')?.textContent.trim().replace(':', '');
                const value = item.querySelector('.profile-value')?.textContent.trim();
                
                if (label && value) {
                    datos.datosPersonales[label.toLowerCase()] = value;
                }
            });
            
            console.log('Datos personales extraídos:', datos.datosPersonales);
        } else {
            console.warn('No se encontró la sección de datos personales');
        }
        
        // Extraer experiencia laboral
        const seccionExperiencia = document.getElementById('experiencia-laboral');
        if (seccionExperiencia) {
            console.log('Extrayendo experiencia laboral de:', seccionExperiencia);
            const experiencias = seccionExperiencia.querySelectorAll('.card-item');
            experiencias.forEach(exp => {
                const titulo = exp.querySelector('.card-title')?.textContent.trim();
                const empresa = exp.querySelector('.card-subtitle')?.textContent.trim();
                const periodo = exp.querySelector('.card-period')?.textContent.trim();
                const descripcion = exp.querySelector('.card-description')?.textContent.trim();
                
                const experiencia = {
                    titulo: titulo || '',
                    empresa: empresa || '',
                    periodo: periodo || '',
                    descripcion: descripcion || '',
                    detalles: {}
                };
                
                // Detalles adicionales
                const detalles = exp.querySelectorAll('.card-info');
                detalles.forEach(detalle => {
                    const label = detalle.querySelector('.card-label')?.textContent.trim().replace(':', '');
                    const value = detalle.querySelector('.card-value')?.textContent.trim();
                    
                    if (label && value) {
                        experiencia.detalles[label.toLowerCase()] = value;
                    }
                });
                
                datos.experienciaLaboral.push(experiencia);
            });
            
            console.log('Experiencia laboral extraída:', datos.experienciaLaboral);
        } else {
            console.warn('No se encontró la sección de experiencia laboral');
        }
        
        // Extraer productos académicos
        const seccionProductosAcademicos = document.getElementById('productos-academicos');
        if (seccionProductosAcademicos) {
            console.log('Extrayendo productos académicos de:', seccionProductosAcademicos);
            const productos = seccionProductosAcademicos.querySelectorAll('.card-item');
            productos.forEach(prod => {
                const titulo = prod.querySelector('.card-title')?.textContent.trim();
                const fecha = prod.querySelector('.card-date')?.textContent.trim();
                const descripcion = prod.querySelector('.card-description')?.textContent.trim();
                
                const producto = {
                    titulo: titulo || '',
                    fecha: fecha || '',
                    descripcion: descripcion || '',
                    detalles: {}
                };
                
                // Detalles adicionales
                const detalles = prod.querySelectorAll('.card-info');
                detalles.forEach(detalle => {
                    const label = detalle.querySelector('.card-label')?.textContent.trim().replace(':', '');
                    const value = detalle.querySelector('.card-value')?.textContent.trim();
                    
                    if (label && value) {
                        producto.detalles[label.toLowerCase()] = value;
                    }
                });
                
                datos.productosAcademicos.push(producto);
            });
            
            console.log('Productos académicos extraídos:', datos.productosAcademicos);
        } else {
            console.warn('No se encontró la sección de productos académicos');
        }
        
        // Extraer productos laborales
        const seccionProductosLaborales = document.getElementById('productos-laborales');
        if (seccionProductosLaborales) {
            console.log('Extrayendo productos laborales de:', seccionProductosLaborales);
            const productos = seccionProductosLaborales.querySelectorAll('.card-item');
            productos.forEach(prod => {
                const titulo = prod.querySelector('.card-title')?.textContent.trim();
                const fecha = prod.querySelector('.card-date')?.textContent.trim();
                const descripcion = prod.querySelector('.card-description')?.textContent.trim();
                
                const producto = {
                    titulo: titulo || '',
                    fecha: fecha || '',
                    descripcion: descripcion || '',
                    detalles: {}
                };
                
                // Detalles adicionales
                const detalles = prod.querySelectorAll('.card-info');
                detalles.forEach(detalle => {
                    const label = detalle.querySelector('.card-label')?.textContent.trim().replace(':', '');
                    const value = detalle.querySelector('.card-value')?.textContent.trim();
                    
                    // Excluir el campo "Valor" de los productos laborales
                    if (label && value && label.toLowerCase() !== 'valor') {
                        producto.detalles[label.toLowerCase()] = value;
                    }
                });
                
                datos.productosLaborales.push(producto);
            });
            
            console.log('Productos laborales extraídos:', datos.productosLaborales);
        } else {
            console.warn('No se encontró la sección de productos laborales');
        }
        
        // Extraer estudios y cursos
        const seccionCursos = document.getElementById('cursos');
        if (seccionCursos) {
            console.log('Extrayendo cursos y estudios de:', seccionCursos);
            
            // Extraer estudios - Buscar elementos con clase card-item que son estudios
            const estudiosItems = seccionCursos.querySelectorAll('.card-item');
            
            // Dividir los elementos en estudios y cursos
            let encontradoDivisor = false;
            
            estudiosItems.forEach(item => {
                // Verificar si este elemento está antes o después del divisor de sección
                const esDespuesDeDivisor = Array.from(seccionCursos.children).some(child => {
                    if (child === item) return encontradoDivisor;
                    if (child.classList.contains('section-divider')) {
                        encontradoDivisor = true;
                        return false;
                    }
                    return false;
                });
                
                // Si está antes del divisor, es un estudio; si está después, es un curso
                if (!esDespuesDeDivisor) {
                    // Es un estudio
                    const titulo = item.querySelector('h4')?.textContent.trim().replace(/En curso/g, '').trim();
                    
                    // Buscar institución
                    let institucion = '';
                    const institucionElement = item.querySelector('.card-info:nth-child(2) .card-value');
                    if (institucionElement) {
                        institucion = institucionElement.textContent.trim();
                    }
                    
                    // Buscar periodo
                    let periodo = '';
                    const periodoElement = item.querySelector('.card-info:nth-child(3) .card-value');
                    if (periodoElement) {
                        periodo = periodoElement.textContent.trim();
                    }
                    
                    const estudio = {
                        titulo: titulo || '',
                        institucion: institucion || '',
                        periodo: periodo || '',
                        detalles: {}
                    };
                    
                    // Detalles adicionales
                    const detallesItems = item.querySelectorAll('.card-info');
                    detallesItems.forEach((detalle, index) => {
                        // Saltar los primeros dos detalles que ya procesamos (institución y periodo)
                        if (index > 1) {
                            const label = detalle.querySelector('.card-label')?.textContent.trim().replace(':', '');
                            const value = detalle.querySelector('.card-value')?.textContent.trim();
                            
                            if (label && value) {
                                estudio.detalles[label.toLowerCase()] = value;
                            }
                        }
                    });
                    
                    // Verificar si hay documento
                    const documentoLinks = item.querySelectorAll('a.btn-certificate');
                    documentoLinks.forEach(link => {
                        if (!link.classList.contains('btn-disabled')) {
                            const docUrl = link.getAttribute('href');
                            estudio.documentoUrl = docUrl;
                            
                            // Añadir a la lista de documentos
                            datos.documentos.estudios.push({
                                titulo: titulo || 'Documento de estudio',
                                url: docUrl
                            });
                        }
                    });
                    
                    datos.estudios.push(estudio);
                } else {
                    // Es un curso
                    const titulo = item.querySelector('h4')?.textContent.trim().replace(/En curso/g, '').trim();
                    
                    // Buscar entidad
                    let entidad = '';
                    const entidadElement = item.querySelector('.card-info:nth-child(2) .card-value');
                    if (entidadElement) {
                        entidad = entidadElement.textContent.trim();
                    }
                    
                    // Buscar periodo
                    let periodo = '';
                    const periodoElement = item.querySelector('.card-info:nth-child(3) .card-value');
                    if (periodoElement) {
                        periodo = periodoElement.textContent.trim();
                    }
                    
                    // Buscar horas
                    let horas = '';
                    const horasElement = item.querySelector('.card-info:nth-child(4) .card-value');
                    if (horasElement) {
                        horas = horasElement.textContent.trim();
                    }
                    
                    const curso = {
                        titulo: titulo || '',
                        entidad: entidad || '',
                        periodo: periodo || '',
                        horas: horas || '',
                        detalles: {}
                    };
                    
                    // Detalles adicionales
                    const detallesItems = item.querySelectorAll('.card-info');
                    detallesItems.forEach((detalle, index) => {
                        // Saltar los primeros tres detalles que ya procesamos (entidad, periodo, horas)
                        if (index > 2) {
                            const label = detalle.querySelector('.card-label')?.textContent.trim().replace(':', '');
                            const value = detalle.querySelector('.card-value')?.textContent.trim();
                            
                            if (label && value) {
                                curso.detalles[label.toLowerCase()] = value;
                            }
                        }
                    });
                    
                    // Verificar si hay certificado
                    const certificadoLinks = item.querySelectorAll('a.btn-certificate');
                    certificadoLinks.forEach(link => {
                        if (!link.classList.contains('btn-disabled')) {
                            const certUrl = link.getAttribute('href');
                            curso.certificadoUrl = certUrl;
                            
                            // Añadir a la lista de documentos
                            datos.documentos.cursos.push({
                                titulo: titulo || 'Certificado de curso',
                                url: certUrl
                            });
                        }
                    });
                    
                    datos.cursos.push(curso);
                }
            });
            
            console.log('Estudios extraídos:', datos.estudios);
            console.log('Cursos extraídos:', datos.cursos);
        } else {
            console.warn('No se encontró la sección de cursos y títulos');
        }
        
        // Extraer reconocimientos
        const seccionReconocimientos = document.getElementById('reconocimientos');
        if (seccionReconocimientos) {
            console.log('Extrayendo reconocimientos de:', seccionReconocimientos);
            
            // Buscar todos los elementos de reconocimiento
            const reconocimientosItems = seccionReconocimientos.querySelectorAll('.card-item');
            
            reconocimientosItems.forEach(rec => {
                const titulo = rec.querySelector('.card-title')?.textContent.trim();
                
                // Buscar fecha
                let fecha = '';
                const fechaElement = rec.querySelector('.card-info:nth-child(2) .card-value');
                if (fechaElement) {
                    fecha = fechaElement.textContent.trim();
                }
                
                // Buscar descripción
                let descripcion = '';
                const descripcionElement = rec.querySelector('.card-info:nth-child(4) .card-value');
                if (descripcionElement) {
                    descripcion = descripcionElement.textContent.trim();
                }
                
                const reconocimiento = {
                    titulo: titulo || '',
                    fecha: fecha || '',
                    descripcion: descripcion || '',
                    detalles: {}
                };
                
                // Detalles adicionales
                const detallesItems = rec.querySelectorAll('.card-info');
                detallesItems.forEach(detalle => {
                    const label = detalle.querySelector('.card-label')?.textContent.trim().replace(':', '');
                    const value = detalle.querySelector('.card-value')?.textContent.trim();
                    
                    if (label && value) {
                        reconocimiento.detalles[label.toLowerCase()] = value;
                    }
                });
                
                // Verificar si hay documento
                const documentoLinks = rec.querySelectorAll('a.btn-certificate');
                documentoLinks.forEach(link => {
                    if (!link.classList.contains('btn-disabled')) {
                        const docUrl = link.getAttribute('href');
                        reconocimiento.documentoUrl = docUrl;
                    }
                });
                
                // Determinar si es reconocimiento general o laboral
                // Buscamos un badge que indique el tipo
                const tipoBadge = rec.querySelector('.tipo-badge');
                if (tipoBadge && tipoBadge.classList.contains('tipo-laboral')) {
                    datos.reconocimientosLaborales.push(reconocimiento);
                    
                    // Añadir a la lista de documentos si tiene documento
                    if (reconocimiento.documentoUrl) {
                        datos.documentos.reconocimientosLaborales.push({
                            titulo: titulo || 'Documento de reconocimiento laboral',
                            url: reconocimiento.documentoUrl
                        });
                    }
                } else {
                    datos.reconocimientosGenerales.push(reconocimiento);
                    
                    // Añadir a la lista de documentos si tiene documento
                    if (reconocimiento.documentoUrl) {
                        datos.documentos.reconocimientosGenerales.push({
                            titulo: titulo || 'Documento de reconocimiento general',
                            url: reconocimiento.documentoUrl
                        });
                    }
                }
            });
            
            console.log('Reconocimientos generales extraídos:', datos.reconocimientosGenerales);
            console.log('Reconocimientos laborales extraídos:', datos.reconocimientosLaborales);
        } else {
            console.warn('No se encontró la sección de reconocimientos');
        }
    } finally {
        // Restaurar los estilos originales de display
        originalDisplayStyles.forEach(item => {
            item.element.style.display = item.style;
        });
    }
    
    console.log('Datos extraídos completos:', datos);
    return datos;
}

/**
 * Carga una imagen desde una URL y la convierte a base64
 */
function cargarImagen(url) {
    return new Promise((resolve, reject) => {
        console.log('Intentando cargar imagen desde:', url);
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        img.onload = function() {
            console.log('Imagen cargada correctamente, dimensiones:', img.width, 'x', img.height);
            // Crear un canvas para convertir la imagen a base64
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Convertir a base64
            const dataURL = canvas.toDataURL('image/jpeg');
            
            resolve({
                dataURL: dataURL,
                width: img.width,
                height: img.height
            });
        };
        
        img.onerror = function() {
            console.error('Error al cargar la imagen:', url);
            reject(new Error('Error al cargar la imagen: ' + url));
        };
        
        img.src = url;
    });
}

/**
 * Genera el PDF con las opciones seleccionadas
 */
async function generarPDF() {
    console.log('Iniciando generación de PDF');
    
    // Recopilar opciones seleccionadas
    const opciones = {
        datosPersonales: document.getElementById('pdf-include-personal').checked,
        experienciaLaboral: document.getElementById('pdf-include-experience').checked,
        productosAcademicos: document.getElementById('pdf-include-academic').checked,
        productosLaborales: document.getElementById('pdf-include-products').checked,
        educacion: document.getElementById('pdf-include-education').checked,
        estudios: document.getElementById('pdf-include-studies').checked,
        cursos: document.getElementById('pdf-include-courses').checked,
        documentosEducacion: document.getElementById('pdf-include-education-docs').checked,
        reconocimientos: document.getElementById('pdf-include-recognition').checked,
        reconocimientosGenerales: document.getElementById('pdf-include-general-recognition').checked,
        reconocimientosLaborales: document.getElementById('pdf-include-work-recognition').checked,
        documentosReconocimientos: document.getElementById('pdf-include-recognition-docs').checked
    };
    
    console.log('Opciones seleccionadas:', opciones);
    
    // Mostrar indicador de carga
    mostrarCargando('Extrayendo información...');
    
    try {
        // Verificar que jsPDF esté disponible
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
            throw new Error('La biblioteca jsPDF no está disponible');
        }
        
        // Extraer datos de las secciones
        const datos = extraerDatos();
        
        // Mostrar mensaje de carga actualizado
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
        
        // Función para agregar texto con salto de línea automático
        function addWrappedText(text, x, y, maxWidth, lineHeight = 7) {
            if (!text) return y;
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            return y + lines.length * lineHeight;
        }
        
        // Función para agregar una nueva página si es necesario
        function checkPageBreak(requiredSpace) {
            if (y + requiredSpace > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                y = 20;
                return true;
            }
            return false;
        }
        
        // Función para añadir un título de sección
        function addSectionTitle(title) {
            checkPageBreak(15);
            doc.setFontSize(16);
            doc.setTextColor(0, 71, 171); // Azul cobalto
            doc.text(title, margin, y);
            y += 10;
            
            // Línea separadora
            doc.setDrawColor(0, 71, 171);
            doc.setLineWidth(0.5);
            doc.line(margin, y - 5, pageWidth - margin, y - 5);
            
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
        }
        
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
        if (opciones.datosPersonales) {
            addSectionTitle('Datos Personales');
            
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
                y = addWrappedText(datos.datosPersonales.dirección, margin + 25, yLeft, contentWidth - 25);
                yLeft = y;
            }
            
            // Columna derecha
            let yRight = y;
            const middleX = pageWidth / 2;
            
            if (datos.datosPersonales.edad) {
                doc.setFont("helvetica", "bold");
                doc.text('Edad:', middleX, yRight);
                doc.setFont("helvetica", "normal");
                doc.text(datos.datosPersonales.edad, middleX + 25, yRight);
                yRight += 7;
            }
            
            if (datos.datosPersonales.nacionalidad) {
                doc.setFont("helvetica", "bold");
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
                y = addWrappedText(datos.datosPersonales.descripcion, margin, y, contentWidth);
            }
            
            y += 10;
        }
        
        // Experiencia Laboral
        if (opciones.experienciaLaboral && datos.experienciaLaboral.length > 0) {
            addSectionTitle('Experiencia Laboral');
            
            datos.experienciaLaboral.forEach((exp, index) => {
                checkPageBreak(25);
                
                // Título y empresa
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.text(exp.titulo, margin, y);
                y += 7;
                
                doc.setFontSize(12);
                doc.text(exp.empresa, margin, y);
                y += 7;
                
                // Periodo
                doc.setFont("helvetica", "italic");
                doc.setFontSize(11);
                doc.text(exp.periodo, margin, y);
                y += 7;
                
                // Descripción
                doc.setFont("helvetica", "normal");
                y = addWrappedText(exp.descripcion, margin, y, contentWidth);
                
                // Detalles adicionales
                if (Object.keys(exp.detalles).length > 0) {
                    y += 5;
                    Object.entries(exp.detalles).forEach(([key, value]) => {
                        checkPageBreak(10);
                        doc.setFont("helvetica", "bold");
                        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, margin, y);
                        doc.setFont("helvetica", "normal");
                        y = addWrappedText(value, margin + 35, y, contentWidth - 35);
                    });
                }
                
                // Separador entre experiencias
                if (index < datos.experienciaLaboral.length - 1) {
                    y += 7;
                    doc.setDrawColor(200, 200, 200);
                    doc.setLineWidth(0.2);
                    doc.line(margin, y - 3, pageWidth - margin, y - 3);
                }
                
                y += 7;
            });
            
            y += 5;
        }
        
        // Productos Académicos
        if (opciones.productosAcademicos && datos.productosAcademicos.length > 0) {
            addSectionTitle('Productos Académicos');
            
            datos.productosAcademicos.forEach((prod, index) => {
                checkPageBreak(25);
                
                // Título
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.text(prod.titulo, margin, y);
                y += 7;
                
                // Fecha
                doc.setFont("helvetica", "italic");
                doc.setFontSize(11);
                doc.text(prod.fecha, margin, y);
                y += 7;
                
                // Descripción
                doc.setFont("helvetica", "normal");
                y = addWrappedText(prod.descripcion, margin, y, contentWidth);
                
                // Detalles adicionales
                if (Object.keys(prod.detalles).length > 0) {
                    y += 5;
                    Object.entries(prod.detalles).forEach(([key, value]) => {
                        checkPageBreak(10);
                        doc.setFont("helvetica", "bold");
                        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, margin, y);
                        doc.setFont("helvetica", "normal");
                        y = addWrappedText(value, margin + 35, y, contentWidth - 35);
                    });
                }
                
                // Separador entre productos
                if (index < datos.productosAcademicos.length - 1) {
                    y += 7;
                    doc.setDrawColor(200, 200, 200);
                    doc.setLineWidth(0.2);
                    doc.line(margin, y - 3, pageWidth - margin, y - 3);
                }
                
                y += 7;
            });
            
            y += 5;
        }
        
        // Productos Laborales
        if (opciones.productosLaborales && datos.productosLaborales.length > 0) {
            addSectionTitle('Productos Laborales');
            
            datos.productosLaborales.forEach((prod, index) => {
                checkPageBreak(25);
                
                // Título
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.text(prod.titulo, margin, y);
                y += 7;
                
                // Fecha
                doc.setFont("helvetica", "italic");
                doc.setFontSize(11);
                doc.text(prod.fecha, margin, y);
                y += 7;
                
                // Descripción
                doc.setFont("helvetica", "normal");
                y = addWrappedText(prod.descripcion, margin, y, contentWidth);
                
                // Detalles adicionales (excluyendo el campo "Valor")
                if (Object.keys(prod.detalles).length > 0) {
                    y += 5;
                    Object.entries(prod.detalles).forEach(([key, value]) => {
                        if (key.toLowerCase() !== 'valor') {
                            checkPageBreak(10);
                            doc.setFont("helvetica", "bold");
                            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, margin, y);
                            doc.setFont("helvetica", "normal");
                            y = addWrappedText(value, margin + 35, y, contentWidth - 35);
                        }
                    });
                }
                
                // Separador entre productos
                if (index < datos.productosLaborales.length - 1) {
                    y += 7;
                    doc.setDrawColor(200, 200, 200);
                    doc.setLineWidth(0.2);
                    doc.line(margin, y - 3, pageWidth - margin, y - 3);
                }
                
                y += 7;
            });
            
            y += 5;
        }
        
        // Estudios
        if (opciones.educacion && opciones.estudios && datos.estudios.length > 0) {
            addSectionTitle('Formación Académica');
            
            datos.estudios.forEach((est, index) => {
                checkPageBreak(25);
                
                // Título
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.text(est.titulo, margin, y);
                y += 7;
                
                // Institución
                doc.setFontSize(12);
                doc.text(est.institucion, margin, y);
                y += 7;
                
                // Periodo
                doc.setFont("helvetica", "italic");
                doc.setFontSize(11);
                doc.text(est.periodo, margin, y);
                y += 7;
                
                // Detalles adicionales
                if (Object.keys(est.detalles).length > 0) {
                    doc.setFont("helvetica", "normal");
                    Object.entries(est.detalles).forEach(([key, value]) => {
                        checkPageBreak(10);
                        doc.setFont("helvetica", "bold");
                        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, margin, y);
                        doc.setFont("helvetica", "normal");
                        y = addWrappedText(value, margin + 35, y, contentWidth - 35);
                    });
                }
                
                // Indicar si hay documento disponible
                if (est.documentoUrl && opciones.documentosEducacion) {
                    checkPageBreak(7);
                    doc.setFontSize(9);
                    doc.setTextColor(0, 71, 171);
                    doc.text("* Documento disponible en anexos", margin, y);
                    doc.setTextColor(0, 0, 0);
                    y += 5;
                }
                
                // Separador entre estudios
                if (index < datos.estudios.length - 1) {
                    y += 5;
                    doc.setDrawColor(200, 200, 200);
                    doc.setLineWidth(0.2);
                    doc.line(margin, y - 3, pageWidth - margin, y - 3);
                }
                
                y += 7;
            });
            
            y += 5;
        }
        
        // Cursos
        if (opciones.educacion && opciones.cursos && datos.cursos.length > 0) {
            addSectionTitle('Cursos Realizados');
            
            datos.cursos.forEach((curso, index) => {
                checkPageBreak(25);
                
                // Título
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.text(curso.titulo, margin, y);
                y += 7;
                
                // Entidad
                if (curso.entidad) {
                    doc.setFontSize(12);
                    doc.text(curso.entidad, margin, y);
                    y += 7;
                }
                
                // Fecha y horas
                doc.setFont("helvetica", "italic");
                doc.setFontSize(11);
                let metaText = curso.periodo || '';
                if (curso.horas) {
                    metaText += ` - ${curso.horas}`;
                }
                if (metaText) {
                    doc.text(metaText, margin, y);
                    y += 7;
                }
                
                // Descripción si está en detalles
                if (curso.detalles.descripción) {
                    doc.setFont("helvetica", "normal");
                    y = addWrappedText(curso.detalles.descripción, margin, y, contentWidth);
                }
                
                // Otros detalles adicionales
                if (Object.keys(curso.detalles).length > 0) {
                    doc.setFont("helvetica", "normal");
                    Object.entries(curso.detalles).forEach(([key, value]) => {
                        if (key.toLowerCase() !== 'descripción') {
                            checkPageBreak(10);
                            doc.setFont("helvetica", "bold");
                            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, margin, y);
                            doc.setFont("helvetica", "normal");
                            y = addWrappedText(value, margin + 35, y, contentWidth - 35);
                        }
                    });
                }
                
                // Indicar si hay certificado disponible
                if (curso.certificadoUrl && opciones.documentosEducacion) {
                    checkPageBreak(7);
                    doc.setFontSize(9);
                    doc.setTextColor(0, 71, 171);
                    doc.text("* Certificado disponible en anexos", margin, y);
                    doc.setTextColor(0, 0, 0);
                    y += 5;
                }
                
                // Separador entre cursos
                if (index < datos.cursos.length - 1) {
                    y += 5;
                    doc.setDrawColor(200, 200, 200);
                    doc.setLineWidth(0.2);
                    doc.line(margin, y - 3, pageWidth - margin, y - 3);
                }
                
                y += 7;
            });
            
            y += 5;
        }
        
        // Reconocimientos Generales
        if (opciones.reconocimientos && opciones.reconocimientosGenerales && datos.reconocimientosGenerales.length > 0) {
            addSectionTitle('Reconocimientos Generales');
            
            datos.reconocimientosGenerales.forEach((rec, index) => {
                checkPageBreak(25);
                
                // Título
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.text(rec.titulo, margin, y);
                y += 7;
                
                // Fecha
                doc.setFont("helvetica", "italic");
                doc.setFontSize(11);
                doc.text(rec.fecha, margin, y);
                y += 7;
                
                // Descripción
                doc.setFont("helvetica", "normal");
                y = addWrappedText(rec.descripcion, margin, y, contentWidth);
                
                // Detalles adicionales
                if (Object.keys(rec.detalles).length > 0) {
                    y += 5;
                    Object.entries(rec.detalles).forEach(([key, value]) => {
                        if (key.toLowerCase() !== 'fecha' && key.toLowerCase() !== 'descripción') {
                            checkPageBreak(10);
                            doc.setFont("helvetica", "bold");
                            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, margin, y);
                            doc.setFont("helvetica", "normal");
                            y = addWrappedText(value, margin + 35, y, contentWidth - 35);
                        }
                    });
                }
                
                // Indicar si hay documento disponible
                if (rec.documentoUrl && opciones.documentosReconocimientos) {
                    checkPageBreak(7);
                    doc.setFontSize(9);
                    doc.setTextColor(0, 71, 171);
                    doc.text("* Documento disponible en anexos", margin, y);
                    doc.setTextColor(0, 0, 0);
                    y += 5;
                }
                
                // Separador entre reconocimientos
                if (index < datos.reconocimientosGenerales.length - 1) {
                    y += 5;
                    doc.setDrawColor(200, 200, 200);
                    doc.setLineWidth(0.2);
                    doc.line(margin, y - 3, pageWidth - margin, y - 3);
                }
                
                y += 7;
            });
            
            y += 5;
        }
        
        // Reconocimientos Laborales
        if (opciones.reconocimientos && opciones.reconocimientosLaborales && datos.reconocimientosLaborales.length > 0) {
            addSectionTitle('Reconocimientos Laborales');
            
            datos.reconocimientosLaborales.forEach((rec, index) => {
                checkPageBreak(25);
                
                // Título
                doc.setFontSize(13);
                doc.setFont("helvetica", "bold");
                doc.text(rec.titulo, margin, y);
                y += 7;
                
                // Fecha
                doc.setFont("helvetica", "italic");
                doc.setFontSize(11);
                doc.text(rec.fecha, margin, y);
                y += 7;
                
                // Descripción
                doc.setFont("helvetica", "normal");
                y = addWrappedText(rec.descripcion, margin, y, contentWidth);
                
                // Detalles adicionales
                if (Object.keys(rec.detalles).length > 0) {
                    y += 5;
                    Object.entries(rec.detalles).forEach(([key, value]) => {
                        if (key.toLowerCase() !== 'fecha' && key.toLowerCase() !== 'descripción') {
                            checkPageBreak(10);
                            doc.setFont("helvetica", "bold");
                            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, margin, y);
                            doc.setFont("helvetica", "normal");
                            y = addWrappedText(value, margin + 35, y, contentWidth - 35);
                        }
                    });
                }
                
                // Indicar si hay documento disponible
                if (rec.documentoUrl && opciones.documentosReconocimientos) {
                    checkPageBreak(7);
                    doc.setFontSize(9);
                    doc.setTextColor(0, 71, 171);
                    doc.text("* Documento disponible en anexos", margin, y);
                    doc.setTextColor(0, 0, 0);
                    y += 5;
                }
                
                // Separador entre reconocimientos
                if (index < datos.reconocimientosLaborales.length - 1) {
                    y += 5;
                    doc.setDrawColor(200, 200, 200);
                    doc.setLineWidth(0.2);
                    doc.line(margin, y - 3, pageWidth - margin, y - 3);
                }
                
                y += 7;
            });
            
            y += 5;
        }
        
        // Anexos (Documentos)
        const incluirDocumentosEducacion = opciones.educacion && opciones.documentosEducacion;
        const incluirDocumentosReconocimientos = opciones.reconocimientos && opciones.documentosReconocimientos;
        
        const documentosEstudios = incluirDocumentosEducacion ? datos.documentos.estudios : [];
        const documentosCursos = incluirDocumentosEducacion ? datos.documentos.cursos : [];
        const documentosReconocimientosGenerales = incluirDocumentosReconocimientos ? datos.documentos.reconocimientosGenerales : [];
        const documentosReconocimientosLaborales = incluirDocumentosReconocimientos ? datos.documentos.reconocimientosLaborales : [];
        
        const totalDocumentos = documentosEstudios.length + documentosCursos.length + 
                              documentosReconocimientosGenerales.length + documentosReconocimientosLaborales.length;
        
        if (totalDocumentos > 0) {
            // Actualizar mensaje de carga
            mostrarCargando('Cargando documentos para anexos...');
            
            // Crear una nueva página para los anexos
            doc.addPage();
            y = 20;
            
            addSectionTitle('Anexos - Documentos');
            
            // Lista de documentos
            let docIndex = 1;
            
            // Función para añadir un documento
            async function addDocument(documento, index, tipo) {
                try {
                    checkPageBreak(15);
                    
                    // Título del documento
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "bold");
                    doc.text(`${index}. ${documento.titulo} (${tipo})`, margin, y);
                    y += 10;
                    
                    // Intentar cargar la imagen
                    try {
                        // Cargar la imagen
                        const imagen = await cargarImagen(documento.url);
                        
                        // Calcular dimensiones para mantener la proporción
                        const imgWidth = Math.min(contentWidth, imagen.width);
                        const imgHeight = (imagen.height * imgWidth) / imagen.width;
                        
                        // Verificar si la imagen cabe en la página actual
                        if (y + imgHeight > doc.internal.pageSize.getHeight() - margin) {
                            doc.addPage();
                            y = 20;
                        }
                        
                        // Añadir la imagen
                        doc.addImage(
                            imagen.dataURL,
                            'JPEG',
                            margin,
                            y,
                            imgWidth,
                            imgHeight
                        );
                        
                        y += imgHeight + 15;
                    } catch (imgError) {
                        console.error(`Error al cargar la imagen del documento ${documento.titulo}:`, imgError);
                        
                        // Añadir enlace al documento en lugar de la imagen
                        doc.setFontSize(10);
                        doc.setTextColor(0, 0, 255);
                        doc.textWithLink('Ver documento (enlace externo)', margin, y, {
                            url: documento.url
                        });
                        doc.setTextColor(0, 0, 0);
                        y += 10;
                    }
                    
                } catch (error) {
                    console.error(`Error al procesar el documento ${documento.titulo}:`, error);
                    
                    // Añadir mensaje de error
                    doc.setFontSize(10);
                    doc.setTextColor(255, 0, 0);
                    doc.text(`No se pudo cargar el documento: ${error.message}`, margin, y);
                    doc.setTextColor(0, 0, 0);
                    y += 10;
                }
            }
            
            // Documentos de estudios
            for (const documento of documentosEstudios) {
                await addDocument(documento, docIndex++, 'Título académico');
            }
            
            // Documentos de cursos
            for (const documento of documentosCursos) {
                await addDocument(documento, docIndex++, 'Certificado de curso');
            }
            
            // Documentos de reconocimientos generales
            for (const documento of documentosReconocimientosGenerales) {
                await addDocument(documento, docIndex++, 'Reconocimiento general');
            }
            
            // Documentos de reconocimientos laborales
            for (const documento of documentosReconocimientosLaborales) {
                await addDocument(documento, docIndex++, 'Reconocimiento laboral');
            }
        }
        
        // Pie de página en todas las páginas
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Hoja de vida generada el ${new Date().toLocaleDateString()} - Página ${i} de ${totalPages}`, margin, doc.internal.pageSize.getHeight() - 10);
        }
        
        // Actualizar mensaje de carga
        mostrarCargando('Finalizando y descargando PDF...');
        
        // Intentar guardar el PDF
        console.log('Guardando PDF...');
        doc.save('hoja_de_vida.pdf');
        
        console.log('PDF generado y guardado correctamente');
        ocultarCargando();
        
        // Ocultar el panel después de generar el PDF
        const panelContainer = document.getElementById('pdf-export-panel-container');
        if (panelContainer) {
            panelContainer.classList.remove('active');
        }
        
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        ocultarCargando();
        alert('Error al generar el PDF: ' + error.message);
    }
}