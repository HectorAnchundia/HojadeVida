from django.urls import path
from . import views
from . import export_views
from . import pdf_export

urlpatterns = [
    # Vistas principales
    path('', views.HomeView.as_view(), name='home'),
    path('perfil/', views.PerfilView.as_view(), name='perfil'),
    path('experiencia/', views.ExperienciaLaboralView.as_view(), name='experiencia'),
    path('productos-academicos/', views.ProductosAcademicosView.as_view(), name='productos_academicos'),
    path('productos-laborales/', views.ProductosLaboralesView.as_view(), name='productos_laborales'),
    path('cursos/', views.CursosView.as_view(), name='cursos'),
    path('reconocimientos/', views.ReconocimientosView.as_view(), name='reconocimientos'),
    path('venta-garaje/', views.VentaGarajeView.as_view(), name='venta_garaje'),
    
    # Endpoint para generar archivo comprimido
    path('generar-archivo-comprimido/', export_views.generar_archivo_comprimido, name='generar_archivo_comprimido'),
    
    # Exportación de PDF
    path('export-pdf/', pdf_export.pdf_export_view, name='pdf_export_view'),
    path('generate-pdf/', pdf_export.generate_pdf, name='generate_pdf'),
]