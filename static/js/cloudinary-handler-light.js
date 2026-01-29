/**
 * Manejador optimizado de Cloudinary
 * Versión ligera que reduce la carga en el navegador
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si la página ya ha sido procesada para evitar múltiples ejecuciones
    if (window.cloudinaryProcessed) return;
    window.cloudinaryProcessed = true;
    
    // Función optimizada para manejar imágenes
    function handleImages() {
        // Seleccionar solo las imágenes que necesitan procesamiento
        const images = document.querySelectorAll('img[src*="/media/"], img[src*="cloudinary.com"]');
        
        images.forEach(img => {
            const src = img.getAttribute('src');
            
            // Configurar manejador de errores para imágenes
            img.onerror = function() {
                // Evitar bucle infinito
                this.onerror = null;
                
                // Determinar imagen por defecto según contexto
                let defaultImage = '/static/img/default-profile.png';
                if (this.classList.contains('product-image')) {
                    defaultImage = '/static/img/default-product.png';
                }
                
                this.src = defaultImage;
                this.classList.add('fallback-image');
            };
        });
    }
    
    // Función optimizada para manejar enlaces a archivos
    function handleFileLinks() {
        // Seleccionar solo los enlaces que necesitan procesamiento
        const fileLinks = document.querySelectorAll('a[href*="cloudinary.com"], a[href*="/media/"]');
        
        fileLinks.forEach(link => {
            // Añadir atributo para abrir en nueva pestaña si no lo tiene
            if (!link.getAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
        });
    }
    
    // Ejecutar las funciones una sola vez
    handleImages();
    handleFileLinks();
});