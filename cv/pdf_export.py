"""
Vistas para la exportación de PDF
"""
import os
from django.http import HttpResponse
from django.template.loader import get_template
from django.conf import settings
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
from django.shortcuts import render
from django.views.decorators.http import require_POST
import json
import base64
import tempfile
from urllib.parse import urljoin
import requests
from io import BytesIO
from django.urls import reverse
from cv.models import DatosPersonales, ExperienciaLaboral, Educacion, CursosRealizado, Reconocimientos, ProductosLaborales

def prepare_cloudinary_images(html_content):
    """
    Prepara las imágenes de Cloudinary para que WeasyPrint pueda procesarlas correctamente.
    Descarga las imágenes y las convierte a data URIs para incluirlas en el PDF.
    """
    import re
    from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Buscar todas las imágenes
    for img in soup.find_all('img'):
        src = img.get('src', '')
        
        # Si es una URL de Cloudinary
        if 'res.cloudinary.com' in src:
            try:
                # Descargar la imagen
                response = requests.get(src, stream=True)
                if response.status_code == 200:
                    # Convertir a data URI
                    img_format = src.split('.')[-1].lower()
                    if img_format not in ['jpg', 'jpeg', 'png', 'gif']:
                        img_format = 'jpeg'
                    
                    img_data = base64.b64encode(response.content).decode('utf-8')
                    data_uri = f"data:image/{img_format};base64,{img_data}"
                    
                    # Reemplazar la URL con el data URI
                    img['src'] = data_uri
            except Exception as e:
                print(f"Error al procesar imagen de Cloudinary: {e}")
    
    return str(soup)

@require_POST
def generate_pdf(request):
    """
    Genera un PDF basado en las opciones seleccionadas por el usuario.
    """
    try:
        # Obtener datos del POST
        data = json.loads(request.body)
        sections = data.get('sections', {})
        
        # Obtener datos del modelo
        datos_personales = DatosPersonales.objects.first()
        experiencias = ExperienciaLaboral.objects.all().order_by('-fechainiciocontrato')
        educacion = Educacion.objects.all().order_by('-fecha_inicio')
        cursos = CursosRealizado.objects.all().order_by('-fechainicio')
        reconocimientos = Reconocimientos.objects.all().order_by('-fechareconocimiento')
        productos = ProductosLaborales.objects.all().order_by('-fechaproducto')
        
        # Filtrar según las secciones seleccionadas
        context = {
            'datos_personales': datos_personales,
            'experiencias': experiencias if sections.get('experiencia', True) else [],
            'educacion': educacion if sections.get('educacion', True) else [],
            'cursos': cursos if sections.get('cursos', True) else [],
            'reconocimientos': reconocimientos if sections.get('reconocimientos', True) else [],
            'productos': productos if sections.get('productos', True) else [],
            'include_images': sections.get('include_images', True),
            'include_certificates': sections.get('include_certificates', False),
        }
        
        # Renderizar la plantilla HTML
        template = get_template('pdf_template.html')
        html_string = template.render(context)
        
        # Preparar imágenes de Cloudinary
        html_string = prepare_cloudinary_images(html_string)
        
        # Configuración de fuentes
        font_config = FontConfiguration()
        
        # Crear un archivo temporal para el CSS
        with tempfile.NamedTemporaryFile(suffix='.css', delete=False) as css_file:
            css_file.write(b"""
            @page {
                size: letter portrait;
                margin: 2cm;
            }
            body {
                font-family: 'Roboto', sans-serif;
                line-height: 1.5;
            }
            h1, h2, h3, h4, h5 {
                font-family: 'Roboto', sans-serif;
                color: #0047AB;
            }
            .section {
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
            .profile-image {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
            }
            .certificate-image {
                max-width: 100%;
                height: auto;
                margin: 10px 0;
            }
            """)
        
        # Crear el PDF
        html = HTML(string=html_string)
        css = CSS(filename=css_file.name)
        
        # Generar el PDF
        pdf_file = html.write_pdf(
            stylesheets=[css],
            font_config=font_config
        )
        
        # Eliminar el archivo temporal de CSS
        os.unlink(css_file.name)
        
        # Crear la respuesta HTTP con el PDF
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="hoja_de_vida.pdf"'
        
        return response
        
    except Exception as e:
        return HttpResponse(f"Error al generar el PDF: {str(e)}", status=500)

def pdf_export_view(request):
    """
    Vista para mostrar la interfaz de exportación de PDF.
    """
    return render(request, 'export_pdf.html')