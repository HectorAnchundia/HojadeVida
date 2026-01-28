"""
Señales para manejar la subida de archivos a Cloudinary antes de guardar en la base de datos
"""
from django.db.models.signals import pre_save
from django.dispatch import receiver
import logging
import requests
import tempfile
import os
from django.core.files import File
from .models import (
    DatosPersonales, 
    ProductosLaborales, 
    CursosRealizado, 
    Reconocimientos, 
    Educacion, 
    ProductoGaraje
)
from .cloudinary_utils import upload_to_cloudinary, get_cloudinary_url

logger = logging.getLogger(__name__)

def handle_upload_error(instance, field_name, error_message):
    """
    Maneja errores durante la subida de archivos a Cloudinary
    
    Args:
        instance: Instancia del modelo
        field_name: Nombre del campo que contiene el archivo
        error_message: Mensaje de error
    """
    logger.error(f"Error al subir archivo a Cloudinary: {error_message}")
    
    # Intentar descargar una imagen de respaldo según el tipo de modelo
    fallback_url = None
    
    if isinstance(instance, DatosPersonales):
        fallback_url = "https://res.cloudinary.com/hojavida/image/upload/v1/default-profile.png"
    elif isinstance(instance, (ProductosLaborales, ProductoGaraje)):
        fallback_url = "https://res.cloudinary.com/hojavida/image/upload/v1/default-product.png"
    elif isinstance(instance, CursosRealizado):
        fallback_url = "https://res.cloudinary.com/hojavida/image/upload/v1/default-certificate.png"
    elif isinstance(instance, Reconocimientos):
        fallback_url = "https://res.cloudinary.com/hojavida/image/upload/v1/default-certificate.png"
    elif isinstance(instance, Educacion):
        fallback_url = "https://res.cloudinary.com/hojavida/image/upload/v1/default-certificate.png"
    
    # Si tenemos una URL de respaldo, intentar usarla
    if fallback_url:
        try:
            # Establecer la URL directa en el campo correspondiente de URL
            url_field_name = f"{field_name}_url"
            if hasattr(instance, url_field_name):
                setattr(instance, url_field_name, fallback_url)
                logger.info(f"Se ha establecido una imagen de respaldo para {instance}: {fallback_url}")
            else:
                # Si no hay campo de URL, intentar descargar la imagen y asignarla al campo original
                response = requests.get(fallback_url)
                if response.status_code == 200:
                    # Crear un archivo temporal
                    temp = tempfile.NamedTemporaryFile(delete=False)
                    temp.write(response.content)
                    temp.flush()
                    
                    # Asignar el archivo temporal al campo
                    file_name = os.path.basename(fallback_url)
                    with open(temp.name, 'rb') as f:
                        django_file = File(f)
                        getattr(instance, field_name).save(file_name, django_file, save=False)
                    
                    # Eliminar el archivo temporal
                    temp.close()
                    os.unlink(temp.name)
                    
                    logger.info(f"Se ha descargado y asignado una imagen de respaldo para {instance}: {fallback_url}")
        except Exception as e:
            logger.error(f"Error al establecer imagen de respaldo: {e}")

@receiver(pre_save, sender=DatosPersonales)
def upload_profile_image_to_cloudinary(sender, instance, **kwargs):
    """Sube la imagen de perfil a Cloudinary antes de guardar el modelo"""
    # Si se proporciona una URL directa, no hacer nada
    if instance.varyingpic_url:
        return
    
    # Verificar si hay un archivo nuevo (no guardado en la base de datos)
    if instance.varyingpic and hasattr(instance.varyingpic, 'file') and not instance.varyingpic.name.startswith('http'):
        logger.info(f"Subiendo imagen de perfil a Cloudinary: {instance.varyingpic.name}")
        try:
            result = upload_to_cloudinary(instance.varyingpic, folder="perfiles")
            if result:
                # Obtener la URL de Cloudinary y asignarla al campo
                cloudinary_url = get_cloudinary_url(result)
                if cloudinary_url:
                    # Guardar la URL directamente en el campo URL
                    instance.varyingpic_url = cloudinary_url
                    # Limpiar el campo de archivo para evitar duplicación
                    instance.varyingpic = None
                    logger.info(f"Imagen de perfil subida a Cloudinary: {cloudinary_url}")
        except Exception as e:
            handle_upload_error(instance, 'varyingpic', str(e))

@receiver(pre_save, sender=ProductosLaborales)
def upload_product_image_to_cloudinary(sender, instance, **kwargs):
    """Sube la imagen del producto laboral a Cloudinary antes de guardar el modelo"""
    # Si se proporciona una URL directa, no hacer nada
    if instance.imagen_url:
        return
    
    if instance.imagen and hasattr(instance.imagen, 'file') and not instance.imagen.name.startswith('http'):
        logger.info(f"Subiendo imagen de producto laboral a Cloudinary: {instance.imagen.name}")
        try:
            result = upload_to_cloudinary(instance.imagen, folder="productos_laborales")
            if result:
                cloudinary_url = get_cloudinary_url(result)
                if cloudinary_url:
                    instance.imagen_url = cloudinary_url
                    instance.imagen = None
                    logger.info(f"Imagen de producto laboral subida a Cloudinary: {cloudinary_url}")
        except Exception as e:
            handle_upload_error(instance, 'imagen', str(e))

@receiver(pre_save, sender=CursosRealizado)
def upload_certificate_to_cloudinary(sender, instance, **kwargs):
    """Sube el certificado del curso a Cloudinary antes de guardar el modelo"""
    # Si se proporciona una URL directa, no hacer nada
    if instance.certificado_url:
        return
    
    if instance.rutacertificado and hasattr(instance.rutacertificado, 'file') and not instance.rutacertificado.name.startswith('http'):
        logger.info(f"Subiendo certificado a Cloudinary: {instance.rutacertificado.name}")
        try:
            result = upload_to_cloudinary(instance.rutacertificado, resource_type="raw", folder="certificados")
            if result:
                cloudinary_url = get_cloudinary_url(result)
                if cloudinary_url:
                    instance.certificado_url = cloudinary_url
                    instance.rutacertificado = None
                    logger.info(f"Certificado subido a Cloudinary: {cloudinary_url}")
        except Exception as e:
            handle_upload_error(instance, 'rutacertificado', str(e))

@receiver(pre_save, sender=Reconocimientos)
def upload_recognition_to_cloudinary(sender, instance, **kwargs):
    """Sube el reconocimiento a Cloudinary antes de guardar el modelo"""
    # Si se proporciona una URL directa, no hacer nada
    if instance.reconocimiento_url:
        return
    
    if instance.rutareconocimiento and hasattr(instance.rutareconocimiento, 'file') and not instance.rutareconocimiento.name.startswith('http'):
        logger.info(f"Subiendo reconocimiento a Cloudinary: {instance.rutareconocimiento.name}")
        try:
            result = upload_to_cloudinary(instance.rutareconocimiento, resource_type="raw", folder="reconocimientos")
            if result:
                cloudinary_url = get_cloudinary_url(result)
                if cloudinary_url:
                    instance.reconocimiento_url = cloudinary_url
                    instance.rutareconocimiento = None
                    logger.info(f"Reconocimiento subido a Cloudinary: {cloudinary_url}")
        except Exception as e:
            handle_upload_error(instance, 'rutareconocimiento', str(e))

@receiver(pre_save, sender=Educacion)
def upload_title_to_cloudinary(sender, instance, **kwargs):
    """Sube el título académico a Cloudinary antes de guardar el modelo"""
    # Si se proporciona una URL directa, no hacer nada
    if instance.titulo_url:
        return
    
    if instance.rutatitulo and hasattr(instance.rutatitulo, 'file') and not instance.rutatitulo.name.startswith('http'):
        logger.info(f"Subiendo título a Cloudinary: {instance.rutatitulo.name}")
        try:
            result = upload_to_cloudinary(instance.rutatitulo, resource_type="raw", folder="titulos")
            if result:
                cloudinary_url = get_cloudinary_url(result)
                if cloudinary_url:
                    instance.titulo_url = cloudinary_url
                    instance.rutatitulo = None
                    logger.info(f"Título subido a Cloudinary: {cloudinary_url}")
        except Exception as e:
            handle_upload_error(instance, 'rutatitulo', str(e))

@receiver(pre_save, sender=ProductoGaraje)
def upload_garage_product_image_to_cloudinary(sender, instance, **kwargs):
    """Sube la imagen del producto de garaje a Cloudinary antes de guardar el modelo"""
    # Si se proporciona una URL directa, no hacer nada
    if instance.imagen_url:
        return
    
    if instance.imagen and hasattr(instance.imagen, 'file') and not instance.imagen.name.startswith('http'):
        logger.info(f"Subiendo imagen de producto de garaje a Cloudinary: {instance.imagen.name}")
        try:
            result = upload_to_cloudinary(instance.imagen, folder="productos_garaje")
            if result:
                cloudinary_url = get_cloudinary_url(result)
                if cloudinary_url:
                    instance.imagen_url = cloudinary_url
                    instance.imagen = None
                    logger.info(f"Imagen de producto de garaje subida a Cloudinary: {cloudinary_url}")
        except Exception as e:
            handle_upload_error(instance, 'imagen', str(e))