"""
Configuración automática de CORS para Cloudinary al iniciar la aplicación
"""
import cloudinary
import cloudinary.uploader
import cloudinary.api
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def setup_cloudinary_cors():
    """
    Configura CORS en Cloudinary para permitir acceso desde cualquier dominio
    Se ejecuta automáticamente al iniciar la aplicación
    """
    try:
        # Configurar Cloudinary con las credenciales
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_STORAGE.get('CLOUD_NAME', 'hojavida'),
            api_key=settings.CLOUDINARY_STORAGE.get('API_KEY', '946365941112319'),
            api_secret=settings.CLOUDINARY_STORAGE.get('API_SECRET', 'h7re7KwS3_yEqL0YbDTht0KGek4'),
            secure=True
        )
        
        # Actualizar la configuración CORS para permitir todos los orígenes
        result = cloudinary.api.update_resources_access_mode_by_prefix(
            prefix="",  # Aplicar a todos los recursos
            access_mode="public",  # Hacer todos los recursos públicos
            resource_type="image"  # Aplicar a imágenes
        )
        
        # Configurar CORS para permitir solicitudes desde cualquier origen
        cors_config = cloudinary.api.update_upload_mapping(
            name="default",
            headers={
                "Access-Control-Allow-Origin": "*"
            }
        )
        
        logger.info("Configuración CORS de Cloudinary actualizada exitosamente")
        logger.info(f"Resultado: {result}")
        logger.info(f"CORS: {cors_config}")
        
        return True
    except Exception as e:
        logger.error(f"Error al configurar CORS en Cloudinary: {e}")
        return False