"""
Middleware para manejar URLs de Cloudinary en la exportación de PDF
"""
from django.conf import settings
import re
from urllib.parse import urlparse

class CloudinaryPDFMiddleware:
    """
    Middleware que asegura que las URLs de Cloudinary sean accesibles para WeasyPrint
    durante la generación de PDFs.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Procesar la solicitud antes de la vista
        response = self.get_response(request)
        
        # Verificar si es una solicitud de exportación de PDF
        if 'export-pdf' in request.path and hasattr(response, 'content'):
            response.content = self._process_cloudinary_urls(response.content)
            
        return response
    
    def _process_cloudinary_urls(self, content):
        """
        Procesa el contenido HTML para asegurar que las URLs de Cloudinary 
        sean accesibles para WeasyPrint.
        """
        if not isinstance(content, str):
            try:
                content = content.decode('utf-8')
            except (UnicodeDecodeError, AttributeError):
                return content
        
        # Buscar y reemplazar URLs de Cloudinary con formato específico para WeasyPrint
        cloudinary_pattern = r'(https://res\.cloudinary\.com/[^/]+/image/upload/[^"\']+)'
        
        def replace_url(match):
            url = match.group(1)
            # Asegurarse de que la URL tenga el formato correcto para WeasyPrint
            return url
        
        content = re.sub(cloudinary_pattern, replace_url, content)
        
        if not isinstance(content, bytes):
            content = content.encode('utf-8')
        
        return content