from django.apps import AppConfig

class CvConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cv'

    def ready(self):
        """
        Importa las señales cuando la aplicación está lista
        para asegurar que se registren correctamente
        """
        import cv.signals  # Importar las señales
        from cv.cloudinary_setup import setup_cloudinary_cors
        
        # Configurar CORS para Cloudinary
        setup_cloudinary_cors()