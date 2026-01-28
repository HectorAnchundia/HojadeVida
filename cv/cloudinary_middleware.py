"""
Middleware para manejar URLs de Cloudinary
"""
import re
import cloudinary
import cloudinary.uploader
import cloudinary.api
from django.conf import settings
from urllib.parse import urlparse

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
            response.content = self._process_cloudinary_urls(response.content)
            
        return response
    
    def _process_cloudinary_urls(self, content):
        """
        Procesa el contenido HTML para asegurar que las URLs de Cloudinary 
        sean accesibles desde cualquier dominio.
        """
        if not isinstance(content, str):
            try:
                content = content.decode('utf-8')
            except (UnicodeDecodeError, AttributeError):
                return content
        
        # Buscar y reemplazar URLs de Cloudinary con formato específico
        cloudinary_pattern = r'(https://res\.cloudinary\.com/[^/]+/image/upload/[^"\']+)'
        
        def replace_url(match):
            url = match.group(1)
            # Asegurarse de que la URL tenga el formato correcto para ser accesible
            # Eliminar cualquier parámetro de firma o versión que pueda causar problemas
            url = re.sub(r'(\/v\d+\/|\/s--[^/]+--\/)', '/', url)
            # Agregar fl_progressive para mejorar la carga
            if 'fl_progressive' not in url:
                url = url.replace('/upload/', '/upload/fl_progressive/')
            return url
        
        content = re.sub(cloudinary_pattern, replace_url, content)
        
        if not isinstance(content, bytes):
            content = content.encode('utf-8')
        
        return content