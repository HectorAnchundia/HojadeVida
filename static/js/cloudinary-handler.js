/**
 * Utilidades para manejar imágenes y archivos de Cloudinary
 * Este script se encarga de corregir URLs, manejar errores de carga y optimizar la visualización
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando manejador de Cloudinary');
    
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
        
        // Construir URL de Cloudinary
        return `https://res.cloudinary.com/hojavida/image/upload/${folder}/${filename}`;
    }
    
    // Función para limpiar URL de Cloudinary (eliminar versión)
    function cleanCloudinaryUrl(url) {
        if (!url || !isCloudinaryUrl(url)) return url;
        
        // Eliminar la parte de versión (v1234567890/)
        return url.replace(/\/v\d+\//, '/');
    }
    
    // Función para manejar errores de carga de imágenes
    function handleImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            
            // Si la URL comienza con /media/, intentar convertirla a URL de Cloudinary
            if (src && src.startsWith('/media/')) {
                const cloudinaryUrl = convertToCloudinaryUrl(src);
                img.setAttribute('src', cloudinaryUrl);
                console.log('Convertida URL local a Cloudinary:', src, '->', cloudinaryUrl);
            } 
            // Si es una URL de Cloudinary, limpiarla
            else if (src && isCloudinaryUrl(src)) {
                const cleanUrl = cleanCloudinaryUrl(src);
                if (cleanUrl !== src) {
                    img.setAttribute('src', cleanUrl);
                    console.log('Limpiada URL de Cloudinary:', src, '->', cleanUrl);
                }
            }
            
            // Configurar manejador de errores para todas las imágenes
            img.onerror = function() {
                console.log('Error cargando imagen:', this.src);
                
                // Si es una URL de Cloudinary que falló, intentar limpiarla y volver a cargar
                if (isCloudinaryUrl(this.src)) {
                    const cleanUrl = cleanCloudinaryUrl(this.src);
                    if (cleanUrl !== this.src) {
                        console.log('Reintentando con URL limpia:', cleanUrl);
                        this.src = cleanUrl;
                        return;
                    }
                    
                    // Si es una URL de imagen, intentar con formato diferente
                    if (this.src.includes('/image/upload/')) {
                        // Asegurar que tenga transformaciones para optimización
                        const optimizedUrl = this.src.replace('/image/upload/', '/image/upload/q_auto,f_auto/');
                        if (optimizedUrl !== this.src) {
                            console.log('Reintentando con URL optimizada:', optimizedUrl);
                            this.src = optimizedUrl;
                            return;
                        }
                    }
                }
                
                // Si todos los intentos fallan, usar imagen por defecto
                this.onerror = null; // Evitar bucle infinito
                
                // Determinar la imagen por defecto según el contexto
                let defaultImage = '/static/img/default-profile.png';
                
                if (this.classList.contains('product-image') || 
                    this.parentElement.classList.contains('product-image-container')) {
                    defaultImage = '/static/img/default-product.png';
                }
                
                this.src = defaultImage;
                this.classList.add('fallback-image');
            };
        });
    }
    
    // Función para manejar enlaces a archivos (certificados, títulos, etc.)
    function handleFileLinks() {
        const fileLinks = document.querySelectorAll('a[href*="cloudinary.com"], a[href*="/media/"]');
        
        fileLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Si es una URL local, convertirla a Cloudinary
            if (href && href.startsWith('/media/')) {
                const cloudinaryUrl = convertToCloudinaryUrl(href);
                link.setAttribute('href', cloudinaryUrl);
                // Añadir atributo para abrir en nueva pestaña
                link.setAttribute('target', '_blank');
                // Añadir URL de Render para acceso directo
                link.setAttribute('data-render-url', `https://hojadevida.onrender.com${href}`);
                console.log('Convertido enlace local a Cloudinary:', href, '->', cloudinaryUrl);
            }
            // Si es una URL de Cloudinary, limpiarla
            else if (href && isCloudinaryUrl(href)) {
                const cleanUrl = cleanCloudinaryUrl(href);
                if (cleanUrl !== href) {
                    link.setAttribute('href', cleanUrl);
                    console.log('Limpiado enlace de Cloudinary:', href, '->', cleanUrl);
                }
                
                // Añadir atributo para abrir en nueva pestaña si no lo tiene
                if (!link.getAttribute('target')) {
                    link.setAttribute('target', '_blank');
                }
                
                // Añadir URL de Render para acceso directo
                const renderBaseUrl = 'https://hojadevida.onrender.com';
                link.setAttribute('data-render-url', renderBaseUrl);
                
                // Si el enlace tiene texto como "Ver certificado", "Ver título", etc.
                // Agregar un segundo enlace para acceder directamente desde Render
                const linkText = link.textContent.trim().toLowerCase();
                if (linkText.includes('ver ')) {
                    // Crear un nuevo enlace para Render
                    const renderLink = document.createElement('a');
                    renderLink.href = renderBaseUrl;
                    renderLink.target = '_blank';
                    renderLink.className = 'render-direct-link';
                    renderLink.innerHTML = '<i class="fas fa-external-link-alt"></i> Ver en Render';
                    renderLink.style.marginLeft = '10px';
                    renderLink.style.fontSize = '0.9em';
                    
                    // Insertar después del enlace original
                    link.parentNode.insertBefore(renderLink, link.nextSibling);
                }
            }
        });
    }
    
    // Ejecutar las funciones al cargar la página
    handleImages();
    handleFileLinks();
    
    // También ejecutar cuando se carguen imágenes dinámicamente (para AJAX)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                handleImages();
                handleFileLinks();
            }
        });
    });
    
    // Observar cambios en el DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});