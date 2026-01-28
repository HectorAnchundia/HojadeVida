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

# Ejecutar script para resetear la base de datos
echo "Reseteando la base de datos..."
python reset_db.py

# Ejecutar migraciones desde cero
echo "Ejecutando migraciones..."
python manage.py migrate --settings=hojadevida.settings_render

# Crear directorio para archivos estáticos si no existe
mkdir -p staticfiles

echo "Build completado con éxito!"