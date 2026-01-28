"""
Middleware para manejar URLs de Cloudinary
Compatible con Cloudinary 1.36.0
"""
import re
import logging
from django.conf import settings
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

class CloudinaryURLMiddleware:
    """
    Middleware que asegura que las URLs de Cloudinary se generen correctamente
    y sean accesibles desde cualquier dominio.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Procesar la solicitud antes de la vista
        response = self.get_response(request)
        
        # Solo procesar respuestas HTML
        if hasattr(response, 'content') and 'text/html' in response.get('Content-Type', ''):
            try:
                content = response.content
                if not isinstance(content, str):
                    content = content.decode('utf-8')
                
                # Buscar y reemplazar URLs de Cloudinary
                modified_content = self._process_cloudinary_urls(content)
                
                if not isinstance(modified_content, bytes):
                    modified_content = modified_content.encode('utf-8')
                
                response.content = modified_content
            except Exception as e:
                logger.error(f"Error al procesar URLs de Cloudinary: {e}")
            
        return response
    
    def _process_cloudinary_urls(self, content):
        """
        Procesa el contenido HTML para asegurar que las URLs de Cloudinary 
        sean accesibles desde cualquier dominio.
        """
        # Patrón para detectar URLs de Cloudinary
        cloudinary_pattern = r'(https://res\.cloudinary\.com/[^/]+/image/upload/[^"\']+)'
        
        def replace_url(match):
            url = match.group(1)
            
            # Eliminar parámetros de firma o versión que puedan causar problemas
            url = re.sub(r'(\/v\d+\/|\/s--[^/]+--\/)', '/', url)
            
            # Asegurar que la URL tenga el formato correcto para ser accesible
            if 'q_auto' not in url and 'f_auto' not in url:
                url = url.replace('/upload/', '/upload/q_auto,f_auto/')
            
            return url
        
        return re.sub(cloudinary_pattern, replace_url, content)


class CloudinaryPDFMiddleware:
    """
    Middleware específico para manejar URLs de Cloudinary en PDFs
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Verificar si la solicitud es para generar un PDF
        is_pdf_request = '/generate-pdf/' in request.path
        
        if is_pdf_request:
            # Establecer un atributo en la solicitud para que las vistas sepan que es una solicitud de PDF
            request.is_pdf_request = True
        
        response = self.get_response(request)
        return response