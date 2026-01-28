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

# Ejecutar migraciones normales (no --fake)
echo "Ejecutando migraciones..."
python manage.py migrate --settings=hojadevida.settings_render

# Crear directorio para archivos estáticos si no existe
mkdir -p staticfiles

echo "Build completado con éxito!"