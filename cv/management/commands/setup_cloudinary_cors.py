import cloudinary
import cloudinary.uploader
import cloudinary.api
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Configura CORS en Cloudinary para permitir acceso desde cualquier dominio'

    def handle(self, *args, **kwargs):
        # Configurar Cloudinary con tus credenciales
        cloudinary.config(
            cloud_name='hojavida',
            api_key='946365941112319',
            api_secret='h7re7KwS3_yEqL0YbDTht0KGek4'
        )
        
        try:
            # Obtener la configuración CORS actual
            current_settings = cloudinary.api.resource_types()
            self.stdout.write(self.style.SUCCESS(f"Configuración actual: {current_settings}"))
            
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
            
            self.stdout.write(self.style.SUCCESS('Configuración CORS actualizada exitosamente'))
            self.stdout.write(self.style.SUCCESS(f"Resultado: {result}"))
            self.stdout.write(self.style.SUCCESS(f"CORS: {cors_config}"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al configurar CORS: {e}'))