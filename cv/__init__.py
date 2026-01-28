"""
Configuración inicial de la aplicación CV
"""

# Configuración por defecto de la aplicación
default_app_config = 'cv.apps.CvConfig'

# Configurar CORS para Cloudinary durante el inicio de la aplicación
try:
    from cv.cloudinary_setup import setup_cloudinary_cors
    setup_cloudinary_cors()
except Exception as e:
    # Capturar cualquier error durante la configuración
    # pero permitir que la aplicación se inicie de todos modos
    import logging
    logger = logging.getLogger(__name__)
    logger.error(f"Error al configurar CORS de Cloudinary: {e}")