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
from urllib.parse import urljoin, urlparse
import requests
from io import BytesIO
import logging
from django.urls import reverse
from cv.models import DatosPersonales, ExperienciaLaboral, Educacion, CursosRealizado, Reconocimientos, ProductosLaborales, ProductosAcademicos

logger = logging.getLogger(__name__)

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
                # Limpiar la URL (eliminar versión)
                clean_src = re.sub(r'/v\d+/', '/', src)
                
                # Descargar la imagen
                response = requests.get(clean_src, stream=True)
                if response.status_code == 200:
                    # Convertir a data URI
                    img_format = src.split('.')[-1].lower()
                    if img_format not in ['jpg', 'jpeg', 'png', 'gif']:
                        img_format = 'jpeg'
                    
                    img_data = base64.b64encode(response.content).decode('utf-8')
                    data_uri = f"data:image/{img_format};base64,{img_data}"
                    
                    # Reemplazar la URL con el data URI
                    img['src'] = data_uri
                    logger.info(f"Imagen de Cloudinary procesada correctamente: {clean_src}")
                else:
                    logger.warning(f"No se pudo descargar la imagen de Cloudinary: {clean_src}, código: {response.status_code}")
            except Exception as e:
                logger.error(f"Error al procesar imagen de Cloudinary: {e}")
    
    # Buscar todos los enlaces a documentos (para anexos)
    for a in soup.find_all('a', href=True):
        href = a.get('href', '')
        
        # Si es un enlace a un documento en Cloudinary
        if 'res.cloudinary.com' in href:
            try:
                # Limpiar la URL (eliminar versión)
                clean_href = re.sub(r'/v\d+/', '/', href)
                
                # Actualizar el enlace
                a['href'] = clean_href
                a['target'] = '_blank'
                a['data-cloudinary'] = 'true'
                
                # Si es un PDF o imagen, intentar incluirlo como anexo
                if any(ext in href.lower() for ext in ['.pdf', '.jpg', '.jpeg', '.png']):
                    # Crear un contenedor para el documento
                    doc_container = soup.new_tag('div')
                    doc_container['class'] = 'document-container'
                    
                    # Añadir título del documento
                    doc_title = soup.new_tag('h4')
                    doc_title.string = a.get_text() or "Documento Anexo"
                    doc_container.append(doc_title)
                    
                    if '.pdf' in href.lower():
                        # Para PDFs, solo añadir un enlace mejorado
                        pdf_link = soup.new_tag('p')
                        pdf_link.string = f"Ver documento PDF: {a.get_text()}"
                        pdf_link['class'] = 'pdf-link'
                        doc_container.append(pdf_link)
                    else:
                        # Para imágenes, descargarlas e incluirlas
                        try:
                            response = requests.get(clean_href, stream=True)
                            if response.status_code == 200:
                                img_format = href.split('.')[-1].lower()
                                if img_format not in ['jpg', 'jpeg', 'png', 'gif']:
                                    img_format = 'jpeg'
                                
                                img_data = base64.b64encode(response.content).decode('utf-8')
                                data_uri = f"data:image/{img_format};base64,{img_data}"
                                
                                # Crear imagen para el anexo
                                doc_img = soup.new_tag('img')
                                doc_img['src'] = data_uri
                                doc_img['class'] = 'document-image'
                                doc_img['alt'] = a.get_text() or "Documento Anexo"
                                doc_container.append(doc_img)
                                
                                # Añadir el contenedor a la sección de anexos
                                anexos_section = soup.find(id='anexos')
                                if not anexos_section:
                                    # Crear sección de anexos si no existe
                                    anexos_section = soup.new_tag('div')
                                    anexos_section['id'] = 'anexos'
                                    anexos_section['class'] = 'section anexos-section'
                                    
                                    anexos_title = soup.new_tag('h2')
                                    anexos_title.string = "Anexos"
                                    anexos_section.append(anexos_title)
                                    
                                    # Añadir al final del body
                                    soup.body.append(anexos_section)
                                
                                anexos_section.append(doc_container)
                                logger.info(f"Documento de Cloudinary añadido como anexo: {clean_href}")
                        except Exception as e:
                            logger.error(f"Error al procesar documento para anexo: {e}")
            except Exception as e:
                logger.error(f"Error al procesar enlace a documento de Cloudinary: {e}")
    
    return str(soup)

@require_POST
def generate_pdf(request):
    """
    Genera un PDF basado en las opciones seleccionadas por el usuario.
    """
    try:
        # Obtener opciones del formulario
        include_personal = request.POST.get('includePersonal') == 'true'
        include_experience = request.POST.get('includeExperience') == 'true'
        include_academic = request.POST.get('includeAcademic') == 'true'
        include_products = request.POST.get('includeProducts') == 'true'
        include_education = request.POST.get('includeEducation') == 'true'
        include_studies = request.POST.get('includeStudies') == 'true'
        include_courses = request.POST.get('includeCourses') == 'true'
        include_education_docs = request.POST.get('includeEducationDocs') == 'true'
        include_recognition = request.POST.get('includeRecognition') == 'true'
        include_general_recognition = request.POST.get('includeGeneralRecognition') == 'true'
        include_work_recognition = request.POST.get('includeWorkRecognition') == 'true'
        include_recognition_docs = request.POST.get('includeRecognitionDocs') == 'true'
        include_all_images = request.POST.get('includeAllImages') == 'true'
        
        logger.info(f"Generando PDF con opciones: personal={include_personal}, experience={include_experience}, "
                   f"education_docs={include_education_docs}, recognition_docs={include_recognition_docs}")
        
        # Obtener datos del modelo
        datos_personales = DatosPersonales.objects.first()
        experiencias = ExperienciaLaboral.objects.filter(public=True).order_by('-fechainiciocontrato') if include_experience else []
        
        # Filtrar educación según las opciones
        educacion = []
        cursos = []
        if include_education:
            if include_studies:
                educacion = Educacion.objects.filter(public=True).order_by('-fecha_inicio')
            if include_courses:
                cursos = CursosRealizado.objects.filter(public=True).order_by('-fechainicio')
        
        # Filtrar reconocimientos según las opciones
        reconocimientos = []
        if include_recognition:
            if include_general_recognition and include_work_recognition:
                reconocimientos = Reconocimientos.objects.filter(public=True).order_by('-fechareconocimiento')
            elif include_general_recognition:
                reconocimientos = Reconocimientos.objects.filter(public=True, tipo='general').order_by('-fechareconocimiento')
            elif include_work_recognition:
                reconocimientos = Reconocimientos.objects.filter(public=True, tipo='laboral').order_by('-fechareconocimiento')
        
        # Productos académicos y laborales
        productos_academicos = [] if not include_academic else ProductosAcademicos.objects.filter(public=True)
        productos_laborales = [] if not include_products else ProductosLaborales.objects.filter(public=True).order_by('-fechaproducto')
        
        # Preparar contexto para la plantilla
        context = {
            'datos_personales': datos_personales if include_personal else None,
            'experiencias': experiencias,
            'educacion': educacion,
            'cursos': cursos,
            'reconocimientos': reconocimientos,
            'productos_academicos': productos_academicos,
            'productos_laborales': productos_laborales,
            'include_images': include_all_images,
            'include_education_docs': include_education_docs,
            'include_recognition_docs': include_recognition_docs,
        }
        
        # Renderizar la plantilla HTML
        template = get_template('cv/pdf_template.html')
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
            .document-container {
                margin: 20px 0;
                padding: 10px;
                border: 1px solid #ddd;
                page-break-inside: avoid;
            }
            .document-image {
                max-width: 100%;
                height: auto;
                margin: 10px 0;
                max-height: 500px;
            }
            .pdf-link {
                color: #0047AB;
                font-weight: bold;
            }
            .anexos-section {
                page-break-before: always;
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
        logger.exception(f"Error al generar el PDF: {e}")
        return HttpResponse(f"Error al generar el PDF: {str(e)}", status=500)

def pdf_export_view(request):
    """
    Vista para mostrar la interfaz de exportación de PDF.
    """
    return render(request, 'export_options.html')