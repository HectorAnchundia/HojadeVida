##!/usr/bin/env python
"""
Script para crear un superusuario (administrador) en Django
Este script se ejecutará durante el despliegue en Render
"""

import os
import django
import sys

# Configurar entorno Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hojadevida.settings_render")
django.setup()

from django.contrib.auth.models import User
from django.db.utils import IntegrityError

# Definir credenciales del administrador
ADMIN_USERNAME = 'admin'
ADMIN_EMAIL = 'admin@example.com'
ADMIN_PASSWORD = 'Admin2024!'  # Asegúrate de cambiar esta contraseña en producción

def create_superuser():
    """Crear un superusuario si no existe"""
    try:
        # Verificar si el usuario ya existe
        if User.objects.filter(username=ADMIN_USERNAME).exists():
            print(f"El superusuario '{ADMIN_USERNAME}' ya existe.")
            # Actualizar la contraseña del usuario existente
            user = User.objects.get(username=ADMIN_USERNAME)
            user.set_password(ADMIN_PASSWORD)
            user.save()
            print(f"Contraseña actualizada para el usuario '{ADMIN_USERNAME}'.")
        else:
            # Crear un nuevo superusuario
            User.objects.create_superuser(
                username=ADMIN_USERNAME,
                email=ADMIN_EMAIL,
                password=ADMIN_PASSWORD
            )
            print(f"Superusuario '{ADMIN_USERNAME}' creado con éxito.")
        
        return True
    except IntegrityError:
        print("Error: No se pudo crear el superusuario debido a un conflicto de integridad.")
        return False
    except Exception as e:
        print(f"Error inesperado al crear el superusuario: {e}")
        return False

if __name__ == "__main__":
    print("Iniciando creación de superusuario...")
    success = create_superuser()
    if success:
        print("Proceso de creación de superusuario completado.")
    else:
        print("Falló la creación del superusuario.")
        sys.exit(1)  # Salir con código de error