"""
Script para configurar Google Cloud Storage en Render
"""

import os
import json
import base64
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Configura las credenciales de Google Cloud Storage desde variables de entorno'

    def handle(self, *args, **options):
        # Obtener la variable de entorno con las credenciales codificadas en base64
        credentials_b64 = os.environ.get('GS_CREDENTIALS_B64')
        
        if not credentials_b64:
            self.stdout.write(self.style.ERROR('No se encontró la variable GS_CREDENTIALS_B64'))
            return
        
        try:
            # Decodificar las credenciales
            credentials_json = base64.b64decode(credentials_b64).decode('utf-8')
            
            # Guardar las credenciales en un archivo
            credentials_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'gcs-credentials.json')
            with open(credentials_path, 'w') as f:
                f.write(credentials_json)
            
            # Establecer la variable de entorno GOOGLE_APPLICATION_CREDENTIALS
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
            
            self.stdout.write(self.style.SUCCESS('Credenciales de Google Cloud Storage configuradas correctamente'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al configurar las credenciales: {str(e)}'))