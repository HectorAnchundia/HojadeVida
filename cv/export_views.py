import os
import json
import zipfile
import tempfile
from django.http import HttpResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
import requests

@require_POST
@csrf_exempt  # Para simplificar las pruebas. En producción, usa CSRF protection
def generar_archivo_comprimido(request):
    """
    Genera un archivo ZIP que contiene los documentos seleccionados.
    El PDF de la hoja de vida se genera en el cliente y se envía al servidor.
    """
    try:
        # Verificar que la solicitud tenga los datos necesarios
        if 'pdf_file' not in request.FILES:
            return HttpResponse("Error: No se recibió el archivo PDF", status=400)
        
        # Obtener el PDF generado en el cliente
        pdf_file = request.FILES['pdf_file']
        
        # Obtener los documentos del formulario
        try:
            documentos = json.loads(request.POST.get('documentos', '[]'))
        except json.JSONDecodeError:
            documentos = []
            
        # Crear un archivo temporal para el ZIP
        with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_zip:
            zip_path = temp_zip.name
        
        # Crear el archivo ZIP
        with zipfile.ZipFile(zip_path, 'w') as zip_file:
            # Primero, agregar el PDF de la hoja de vida
            zip_file.writestr('hoja_de_vida.pdf', pdf_file.read())
            
            # Luego, agregar los documentos seleccionados
            for documento in documentos:
                try:
                    url = documento['url']
                    nombre = documento['nombre']
                    
                    # Verificar si es una URL relativa o absoluta
                    if url.startswith('/'):
                        # Es una URL relativa, convertir a absoluta
                        url = request.build_absolute_uri(url)
                    elif not (url.startswith('http://') or url.startswith('https://')):
                        # Es una URL relativa sin barra inicial
                        url = request.build_absolute_uri('/' + url)
                    
                    # Descargar el documento
                    response = requests.get(url, stream=True)
                    if response.status_code == 200:
                        # Crear directorio de documentos si no existe
                        zip_file.writestr(f'documentos/{nombre}', response.content)
                except Exception as e:
                    # Registrar el error pero continuar con los demás documentos
                    print(f"Error al procesar documento {documento.get('nombre', 'desconocido')}: {str(e)}")
                    continue
        
        # Devolver el archivo ZIP como respuesta
        response = FileResponse(open(zip_path, 'rb'), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="hoja_de_vida_completa.zip"'
        
        # Configurar para eliminar el archivo temporal después de enviarlo
        # Guardamos una referencia al archivo abierto
        file_to_close = open(zip_path, 'rb')
        response._file_to_close = file_to_close
        
        # Definimos una función para eliminar el archivo temporal
        def cleanup_tempfile():
            file_to_close.close()
            if os.path.exists(zip_path):
                try:
                    os.unlink(zip_path)
                except:
                    pass
        
        # Registramos la función de limpieza para que se ejecute cuando se cierre la respuesta
        response._resource_closers.append(cleanup_tempfile)
        
        return response
        
    except Exception as e:
        # En caso de error, devolver una respuesta de error detallada
        import traceback
        error_details = traceback.format_exc()
        print(f"Error detallado: {error_details}")
        return HttpResponse(f"Error al generar el archivo comprimido: {str(e)}", status=500)