/**
 * Cloudinary Image Handler
 * Este script maneja la conversión de URLs locales a URLs de Cloudinary
 * y proporciona fallbacks para imágenes que no se pueden cargar
 */

document.addEventListener('DOMContentLoaded', function() {
    // Función para verificar si una URL es de Cloudinary
    function isCloudinaryUrl(url) {
        return url && url.includes('res.cloudinary.com');
    }
    
    // Función para convertir URL local a URL de Cloudinary
    function convertToCloudinaryUrl(url) {
        if (!url || isCloudinaryUrl(url)) return url;
        
        // Extraer la parte final de la URL (nombre del archivo)
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const folder = parts[parts.length - 2] || '';
        
        // Construir URL de Cloudinary sin la parte de versión
        return `https://res.cloudinary.com/hojavida/image/upload/${folder}/${filename}`;
    }
    
    // Función para limpiar URLs de Cloudinary que pudieran tener versiones o comillas
    function cleanCloudinaryUrl(url) {
        if (!url || !url.includes('res.cloudinary.com')) return url;
        
        // Eliminar comillas que pudieran estar en la URL
        let cleanUrl = url.replace(/"/g, '');
        
        // Eliminar la parte de versión (v1234567890/)
        cleanUrl = cleanUrl.replace(/\/v\d+\//, '/');
        
        return cleanUrl;
    }
    
    // Función para manejar errores de carga de imágenes
    function handleImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            
            if (src) {
                // Limpiar la URL si ya es de Cloudinary
                if (src.includes('res.cloudinary.com')) {
                    const cleanedUrl = cleanCloudinaryUrl(src);
                    if (cleanedUrl !== src) {
                        img.setAttribute('src', cleanedUrl);
                        console.log('URL de Cloudinary limpiada:', src, '->', cleanedUrl);
                    }
                }
                // Si la URL comienza con /media/, intentar convertirla a URL de Cloudinary
                else if (src.startsWith('/media/')) {
                    const cloudinaryUrl = convertToCloudinaryUrl(src);
                    img.setAttribute('src', cloudinaryUrl);
                    console.log('Convertida URL local a Cloudinary:', src, '->', cloudinaryUrl);
                }
            }
            
            // Configurar manejador de errores para todas las imágenes
            img.onerror = function() {
                console.log('Error cargando imagen:', this.src);
                
                // Determinar qué imagen de respaldo usar según el contexto
                let fallbackImage = '/static/img/default-profile.png';
                
                if (this.classList.contains('profile-image')) {
                    fallbackImage = '/static/img/default-profile.png';
                } else if (this.classList.contains('producto-image')) {
                    fallbackImage = '/static/img/default-product.png';
                } else if (this.parentElement.classList.contains('certificate-container')) {
                    fallbackImage = '/static/img/default-certificate.png';
                }
                
                // Reemplazar con imagen por defecto si falla la carga
                this.onerror = null;
                this.src = fallbackImage;
                this.classList.add('fallback-image');
            };
        });
    }
    
    // Función para manejar enlaces a archivos (certificados, títulos, etc.)
    function handleFileLinks() {
        const fileLinks = document.querySelectorAll('a[href^="/media/"], a[href*="res.cloudinary.com"]');
        fileLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href) {
                // Limpiar la URL si ya es de Cloudinary
                if (href.includes('res.cloudinary.com')) {
                    const cleanedUrl = cleanCloudinaryUrl(href);
                    if (cleanedUrl !== href) {
                        link.setAttribute('href', cleanedUrl);
                        console.log('URL de enlace Cloudinary limpiada:', href, '->', cleanedUrl);
                    }
                }
                // Convertir URL local a URL de Cloudinary
                else if (href.startsWith('/media/')) {
                    const cloudinaryUrl = convertToCloudinaryUrl(href);
                    link.setAttribute('href', cloudinaryUrl);
                    console.log('Convertido enlace local a Cloudinary:', href, '->', cloudinaryUrl);
                }
            }
        });
    }
    
    // Ejecutar las funciones al cargar la página
    handleImages();
    handleFileLinks();
    
    // También ejecutar después de cargar AJAX o actualizar el DOM
    // Si usas alguna biblioteca para cargar contenido dinámicamente
    document.addEventListener('DOMNodeInserted', function(e) {
        if (e.target.nodeName === 'IMG' || e.target.querySelector('img')) {
            handleImages();
        }
        if (e.target.nodeName === 'A' || e.target.querySelector('a[href^="/media/"], a[href*="res.cloudinary.com"]')) {
            handleFileLinks();
        }
    });
});