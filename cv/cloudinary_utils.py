"""
Utilidades para manejar la subida de imágenes a Cloudinary
"""
import cloudinary
import cloudinary.uploader
import cloudinary.api
import logging
import os
from django.conf import settings

logger = logging.getLogger(__name__)

def upload_to_cloudinary(file_obj, resource_type="image", folder=None):
    """
    Sube un archivo a Cloudinary y devuelve la URL
    
    Args:
        file_obj: Objeto de archivo a subir
        resource_type: Tipo de recurso ('image', 'raw', 'video', etc.)
        folder: Carpeta en Cloudinary donde guardar el archivo
    
    Returns:
        dict: Diccionario con información de la subida, incluyendo 'secure_url'
        None: Si ocurre un error
    """
    try:
        # Asegurarse de que Cloudinary esté configurado
        if not cloudinary.config().cloud_name:
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_STORAGE.get('CLOUD_NAME', 'hojavida'),
                api_key=settings.CLOUDINARY_STORAGE.get('API_KEY', '946365941112319'),
                api_secret=settings.CLOUDINARY_STORAGE.get('API_SECRET', 'h7re7KwS3_yEqL0YbDTht0KGek4'),
                secure=True
            )
        
        # Determinar el nombre del archivo
        filename = os.path.basename(file_obj.name)
        public_id = os.path.splitext(filename)[0]  # Nombre sin extensión
        
        # Configurar opciones de subida
        upload_options = {
            'resource_type': resource_type,
            'public_id': public_id,
            'overwrite': True,
            'format': os.path.splitext(filename)[1][1:],  # Extensión sin el punto
        }
        
        # Añadir carpeta si se especifica
        if folder:
            upload_options['folder'] = folder
        
        # Subir el archivo a Cloudinary
        result = cloudinary.uploader.upload(file_obj, **upload_options)
        logger.info(f"Archivo subido a Cloudinary: {result['secure_url']}")
        return result
    except Exception as e:
        logger.error(f"Error al subir archivo a Cloudinary: {e}")
        return None

def get_cloudinary_url(result):
    """
    Extrae la URL segura de un resultado de subida de Cloudinary
    
    Args:
        result: Diccionario con información de la subida
    
    Returns:
        str: URL segura del archivo en Cloudinary
        None: Si no se puede obtener la URL
    """
    if not result or not isinstance(result, dict) or 'secure_url' not in result:
        return None
    
    # Devolver la URL sin la parte de versión para evitar problemas
    url = result['secure_url']
    # Eliminar la parte de versión (v1234567890)
    url_parts = url.split('/')
    upload_index = url_parts.index('upload')
    if upload_index + 1 < len(url_parts) and url_parts[upload_index + 1].startswith('v'):
        url_parts.pop(upload_index + 1)  # Eliminar la parte de versión
    
    return '/'.join(url_parts)