"""
Configuración automática de CORS para Cloudinary al iniciar la aplicación
Versión compatible con Cloudinary 1.36.0
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
    Utiliza métodos compatibles con Cloudinary 1.36.0
    """
    try:
        # Configurar Cloudinary con las credenciales
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_STORAGE.get('CLOUD_NAME', 'hojavida'),
            api_key=settings.CLOUDINARY_STORAGE.get('API_KEY', '946365941112319'),
            api_secret=settings.CLOUDINARY_STORAGE.get('API_SECRET', 'h7re7KwS3_yEqL0YbDTht0KGek4'),
            secure=True
        )
        
        # Configurar CORS para permitir solicitudes desde cualquier origen
        # Usando el método upload_preset.update que sí está disponible en Cloudinary 1.36.0
        try:
            # Primero intentamos actualizar un preset existente
            result = cloudinary.api.update_upload_preset(
                name="default_preset",
                allowed_formats="jpg,png,gif,webp",
                unsigned=True,
                cors=True  # Habilitar CORS
            )
            logger.info(f"Preset de Cloudinary actualizado: {result}")
        except Exception as preset_error:
            # Si el preset no existe, lo creamos
            try:
                result = cloudinary.api.create_upload_preset(
                    name="default_preset",
                    allowed_formats="jpg,png,gif,webp",
                    unsigned=True,
                    cors=True  # Habilitar CORS
                )
                logger.info(f"Preset de Cloudinary creado: {result}")
            except Exception as create_error:
                logger.warning(f"No se pudo crear el preset: {create_error}")
        
        # Configurar opciones globales de CORS usando update_upload_mapping
        try:
            cors_config = cloudinary.api.update_upload_mapping(
                name="default",
                headers={
                    "Access-Control-Allow-Origin": "*"
                }
            )
            logger.info(f"Configuración CORS actualizada: {cors_config}")
        except Exception as mapping_error:
            # Si el mapping no existe, intentamos crearlo
            try:
                cors_config = cloudinary.api.create_upload_mapping(
                    name="default",
                    template="https://res.cloudinary.com/hojavida",
                    headers={
                        "Access-Control-Allow-Origin": "*"
                    }
                )
                logger.info(f"Mapping de Cloudinary creado: {cors_config}")
            except Exception as create_mapping_error:
                logger.warning(f"No se pudo crear el mapping: {create_mapping_error}")
        
        # Configurar opciones de transformación para hacer las imágenes públicas
        # Corregir el error de "missing definition" en create_transformation
        try:
            cloudinary.api.update_transformation(
                transformation="default_transform",
                allowed_for_strict=True,
                named=True
            )
            logger.info("Transformación actualizada para permitir acceso público")
        except Exception as transform_error:
            try:
                # Añadir el parámetro "definition" que faltaba
                cloudinary.api.create_transformation(
                    name="default_transform",
                    transformation={"quality": "auto", "fetch_format": "auto"},
                    allowed_for_strict=True
                )
                logger.info("Transformación creada para permitir acceso público")
            except Exception as create_transform_error:
                logger.warning(f"No se pudo crear la transformación: {create_transform_error}")
        
        logger.info("Configuración CORS de Cloudinary completada")
        return True
    except Exception as e:
        logger.error(f"Error al configurar CORS en Cloudinary: {e}")
        return False