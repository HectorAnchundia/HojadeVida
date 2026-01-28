"""
Configuración específica para Cloudinary
"""
import cloudinary
from django.conf import settings

# Configurar Cloudinary con las credenciales
cloudinary.config(
    cloud_name=settings.CLOUDINARY_STORAGE.get('CLOUD_NAME', 'hojavida'),
    api_key=settings.CLOUDINARY_STORAGE.get('API_KEY', '946365941112319'),
    api_secret=settings.CLOUDINARY_STORAGE.get('API_SECRET', 'h7re7KwS3_yEqL0YbDTht0KGek4'),
    secure=True
)

# Configuración para asegurar que las URLs de Cloudinary sean públicas y accesibles
CLOUDINARY_URL_OPTIONS = {
    'secure': True,
    'transformation': [
        {'fetch_format': 'auto', 'quality': 'auto'}
    ],
    'version': None,  # Para evitar problemas de caché
    'sign_url': False,  # No firmar URLs para hacerlas más accesibles
    'type': 'upload',  # Tipo de recurso
    'resource_type': 'image'  # Tipo de recurso
}