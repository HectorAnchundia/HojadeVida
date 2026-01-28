"""
WSGI config for hojadevida project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

# Determinar si estamos en Render
if 'RENDER' in os.environ:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hojadevida.settings_render')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hojadevida.settings')

application = get_wsgi_application()