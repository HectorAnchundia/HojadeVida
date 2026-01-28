#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias
pip install -r requirements.txt

# Configurar variable de entorno para Render
export RENDER=true

# Ejecutar comandos de Django con la configuración específica para Render
python manage.py collectstatic --no-input --settings=hojadevida.settings_render
python manage.py migrate --settings=hojadevida.settings_render

# Crear directorio para archivos estáticos si no existe
mkdir -p staticfiles