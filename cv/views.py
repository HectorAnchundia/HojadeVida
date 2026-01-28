from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, ListView
from django.db.models import Case, When, Value, BooleanField, F
from .models import (
    DatosPersonales, 
    ExperienciaLaboral, 
    ProductosAcademicos, 
    ProductosLaborales, 
    CursosRealizado, 
    Reconocimientos,
    Educacion,
    ProductoGaraje
)

class HomeView(TemplateView):
    template_name = 'cv/home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Obtener los datos personales (asumimos que solo hay un registro público)
        try:
            context['datos_personales'] = DatosPersonales.objects.filter(public=True).first()
        except DatosPersonales.DoesNotExist:
            context['datos_personales'] = None
            
        # Obtener experiencias laborales ordenadas: primero las actuales, luego de más reciente a más antigua
        context['experiencias_laborales'] = ExperienciaLaboral.objects.filter(
            public=True
        ).order_by('-trabajo_actual', '-fechainiciocontrato')
        
        # Obtener productos académicos
        context['productos_academicos'] = ProductosAcademicos.objects.filter(
            public=True
        )
        
        # Obtener productos laborales
        context['productos_laborales'] = ProductosLaborales.objects.filter(
            public=True
        ).order_by('-fechaproducto')
        
        # Obtener cursos realizados: primero los en curso, luego de más reciente a más antiguo
        context['cursos'] = CursosRealizado.objects.filter(
            public=True
        ).order_by('-en_curso', '-fechafin')
        
        # Obtener educación: primero los en curso, luego de más reciente a más antiguo
        context['educacion'] = Educacion.objects.filter(
            public=True
        ).order_by('-en_curso', '-fecha_fin', '-fecha_inicio')
        
        # Obtener reconocimientos generales
        context['reconocimientos_generales'] = Reconocimientos.objects.filter(
            public=True,
            tipo='general'
        ).order_by('-fechareconocimiento')
        
        # Obtener reconocimientos laborales
        context['reconocimientos_laborales'] = Reconocimientos.objects.filter(
            public=True,
            tipo='laboral'
        ).order_by('-fechareconocimiento')
        
        return context

class PerfilView(TemplateView):
    template_name = 'cv/perfil.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['datos_personales'] = DatosPersonales.objects.filter(public=True).first()
        return context

class ExperienciaLaboralView(TemplateView):
    template_name = 'cv/experiencia.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Ordenar experiencias laborales: primero las actuales, luego de más reciente a más antigua
        context['experiencias_laborales'] = ExperienciaLaboral.objects.filter(
            public=True
        ).order_by('-trabajo_actual', '-fechainiciocontrato')
        context['datos_personales'] = DatosPersonales.objects.filter(public=True).first()
        return context

class ProductosAcademicosView(TemplateView):
    template_name = 'cv/productos_academicos.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['productos_academicos'] = ProductosAcademicos.objects.filter(public=True)
        context['datos_personales'] = DatosPersonales.objects.filter(public=True).first()
        return context

class ProductosLaboralesView(TemplateView):
    template_name = 'cv/productos_laborales.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['productos_laborales'] = ProductosLaborales.objects.filter(
            public=True
        ).order_by('-fechaproducto')
        context['datos_personales'] = DatosPersonales.objects.filter(public=True).first()
        return context

class CursosView(TemplateView):
    template_name = 'cv/cursos.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Ordenar cursos: primero los en curso, luego de más reciente a más antiguo
        context['cursos'] = CursosRealizado.objects.filter(
            public=True
        ).order_by('-en_curso', '-fechafin')
        
        # Ordenar educación: primero los en curso, luego de más reciente a más antiguo
        context['educacion'] = Educacion.objects.filter(
            public=True
        ).order_by('-en_curso', '-fecha_fin', '-fecha_inicio')
        
        context['datos_personales'] = DatosPersonales.objects.filter(public=True).first()
        return context

class ReconocimientosView(TemplateView):
    template_name = 'cv/reconocimientos.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['reconocimientos_generales'] = Reconocimientos.objects.filter(
            public=True,
            tipo='general'
        ).order_by('-fechareconocimiento')
        context['reconocimientos_laborales'] = Reconocimientos.objects.filter(
            public=True,
            tipo='laboral'
        ).order_by('-fechareconocimiento')
        context['datos_personales'] = DatosPersonales.objects.filter(public=True).first()
        return context

class VentaGarajeView(ListView):
    model = ProductoGaraje
    template_name = 'cv/venta_garaje.html'
    context_object_name = 'productos'
    
    def get_queryset(self):
        return ProductoGaraje.objects.filter(activo=True).order_by('-fecha_publicacion')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['datos_personales'] = DatosPersonales.objects.filter(public=True).first()
        context['is_garaje'] = True  # Indicador para el template de que estamos en la sección de venta de garaje
        return context