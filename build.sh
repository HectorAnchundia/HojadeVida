#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias
pip install -r requirements.txt

# Configurar variable de entorno para Render
export RENDER=true

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
python manage.py collectstatic --no-input --settings=hojadevida.settings_render

# Ejecutar migraciones normales
echo "Ejecutando migraciones..."
python manage.py migrate --settings=hojadevida.settings_render

# Crear superusuario
echo "Creando superusuario..."
python manage.py shell -c "
from django.contrib.auth.models import User
username = 'admin'
password = '1234HRAA'
email = 'admin@example.com'
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superusuario {username} creado con éxito')
else:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.save()
    print(f'Contraseña actualizada para el usuario {username}')
" --settings=hojadevida.settings_render

# Crear directorio para archivos estáticos si no existe
mkdir -p staticfiles

echo "Build completado con éxito!"