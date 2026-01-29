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

def download_cloudinary_file(url):
    """
    Descarga un archivo desde Cloudinary y lo devuelve como un objeto BytesIO
    """
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            return BytesIO(response.content)
        else:
            logger.warning(f"No se pudo descargar el archivo de Cloudinary: {url}, código: {response.status_code}")
            return None
    except Exception as e:
        logger.error(f"Error al descargar archivo de Cloudinary: {e}")
        return None

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
    
    return str(soup)

def collect_documents(educacion, cursos, reconocimientos_generales, reconocimientos_laborales, include_education_docs, include_recognition_docs):
    """
    Recopila todos los documentos adjuntos para incluirlos como anexos
    """
    documentos = []
    
    # Recopilar documentos de educación si está activada la opción
    if include_education_docs:
        # Documentos de educación
        for edu in educacion:
            if edu.titulo_documento:
                documentos.append({
                    'url': edu.titulo_documento,
                    'nombre': f"Título: {edu.titulo}",
                    'tipo': 'titulo',
                    'seccion': 'educacion'
                })
        
        # Documentos de cursos
        for curso in cursos:
            if curso.certificado:
                documentos.append({
                    'url': curso.certificado,
                    'nombre': f"Certificado: {curso.nombrecurso}",
                    'tipo': 'certificado',
                    'seccion': 'cursos'
                })
    
    # Recopilar documentos de reconocimientos si está activada la opción
    if include_recognition_docs:
        # Documentos de reconocimientos generales
        for rec in reconocimientos_generales:
            if rec.documento_reconocimiento:
                documentos.append({
                    'url': rec.documento_reconocimiento,
                    'nombre': f"Reconocimiento General: {rec.tiporeconocimiento}",
                    'tipo': 'reconocimiento',
                    'seccion': 'reconocimientos_generales'
                })
        
        # Documentos de reconocimientos laborales
        for rec in reconocimientos_laborales:
            if rec.documento_reconocimiento:
                documentos.append({
                    'url': rec.documento_reconocimiento,
                    'nombre': f"Reconocimiento Laboral: {rec.tiporeconocimiento}",
                    'tipo': 'reconocimiento',
                    'seccion': 'reconocimientos_laborales'
                })
    
    return documentos

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
        reconocimientos_generales = []
        reconocimientos_laborales = []
        if include_recognition:
            if include_general_recognition:
                reconocimientos_generales = Reconocimientos.objects.filter(public=True, tipo='general').order_by('-fechareconocimiento')
            if include_work_recognition:
                reconocimientos_laborales = Reconocimientos.objects.filter(public=True, tipo='laboral').order_by('-fechareconocimiento')
        
        # Productos académicos y laborales
        productos_academicos = [] if not include_academic else ProductosAcademicos.objects.filter(public=True)
        productos_laborales = [] if not include_products else ProductosLaborales.objects.filter(public=True).order_by('-fechaproducto')
        
        # Recopilar documentos para anexos
        documentos_anexos = collect_documents(
            educacion, 
            cursos, 
            reconocimientos_generales, 
            reconocimientos_laborales,
            include_education_docs,
            include_recognition_docs
        )
        
        # Preparar opciones para la plantilla
        options = {
            'datosPersonales': include_personal,
            'experienciaLaboral': include_experience,
            'productosAcademicos': include_academic,
            'productosLaborales': include_products,
            'educacion': include_studies,
            'cursos': include_courses,
            'estudiosCursos': include_education,
            'reconocimientos': include_recognition,
            'reconocimientosGenerales': include_general_recognition,
            'reconocimientosLaborales': include_work_recognition,
            'incluirDocumentosEducacion': include_education_docs,
            'incluirDocumentosReconocimientos': include_recognition_docs,
            'incluirImagenes': include_all_images,
            'mostrarAnexos': (include_education_docs or include_recognition_docs) and len(documentos_anexos) > 0
        }
        
        # Preparar contexto para la plantilla
        context = {
            'datos_personales': datos_personales if include_personal else None,
            'experiencias': experiencias,
            'educacion': educacion,
            'cursos': cursos,
            'reconocimientos_generales': reconocimientos_generales,
            'reconocimientos_laborales': reconocimientos_laborales,
            'productos_academicos': productos_academicos,
            'productos_laborales': productos_laborales,
            'documentos_anexos': documentos_anexos,
            'options': options,
            'include_images': include_all_images,
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
                color: #333;
                background-color: white;
            }
            h1, h2, h3, h4, h5 {
                font-family: 'Roboto', sans-serif;
                color: #0047AB;
                margin-top: 20px;
                margin-bottom: 10px;
            }
            h1 {
                font-size: 24pt;
                text-align: center;
                margin-bottom: 20px;
            }
            h2 {
                font-size: 18pt;
                border-bottom: 2px solid #0047AB;
                padding-bottom: 5px;
                margin-top: 30px;
            }
            h3 {
                font-size: 14pt;
                color: #0066CC;
            }
            h4 {
                font-size: 12pt;
                color: #0066CC;
            }
            .pdf-container {
                max-width: 800px;
                margin: 0 auto;
            }
            .pdf-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .pdf-perfil-img {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
                margin: 0 auto 15px;
                display: block;
            }
            .pdf-section {
                margin-bottom: 25px;
                page-break-inside: avoid;
            }
            .pdf-item {
                margin-bottom: 20px;
                padding-left: 15px;
                border-left: 3px solid #0066CC;
            }
            .pdf-meta {
                color: #666;
                font-style: italic;
                margin: 5px 0;
            }
            .pdf-datos-personales {
                display: flex;
                flex-wrap: wrap;
            }
            .pdf-datos-col {
                flex: 1;
                min-width: 250px;
                margin-bottom: 15px;
            }
            .pdf-subsection {
                margin-top: 15px;
                margin-bottom: 15px;
            }
            .pdf-footer {
                margin-top: 40px;
                text-align: center;
                font-size: 10pt;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 10px;
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
            p {
                margin: 5px 0;
            }
            strong {
                font-weight: 600;
            }
            .badge {
                display: inline-block;
                padding: 3px 8px;
                background-color: #0066CC;
                color: white;
                border-radius: 12px;
                font-size: 9pt;
                margin-left: 8px;
            }
            .en-curso {
                background-color: #28a745;
            }
            .anexo-item {
                margin: 20px 0;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .anexo-titulo {
                font-size: 14pt;
                color: #0066CC;
                margin-bottom: 10px;
            }
            .anexo-imagen {
                max-width: 100%;
                max-height: 400px;
                margin: 10px 0;
                display: block;
            }
            .anexo-pdf {
                padding: 10px;
                background-color: #f5f5f5;
                border-radius: 5px;
                margin: 10px 0;
            }
            .anexo-seccion {
                font-style: italic;
                color: #666;
                margin-top: 5px;
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