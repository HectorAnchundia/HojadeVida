from django.contrib import admin
from django.utils.html import format_html
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

# Personalización del panel de administración
admin.site.site_header = "Administración de Hoja de Vida"
admin.site.site_title = "Panel de Administración"
admin.site.index_title = "Bienvenido al Panel de Administración"

@admin.register(DatosPersonales)
class DatosPersonalesAdmin(admin.ModelAdmin):
    list_display = ('nombres', 'apellidos', 'ocupacion', 'telefonocelular', 'email_contacto', 'public', 'edad')
    search_fields = ('nombres', 'apellidos', 'numerocedula')
    list_filter = ('public',)
    readonly_fields = ('edad',)
    fieldsets = (
        ('Información Básica', {
            'fields': (('nombres', 'apellidos'), 'ocupacion', 'numerocedula', 'varyingpic', 'esfotoperfil', 'descripcionperfil')
        }),
        ('Datos Personales', {
            'fields': ('fechanacimiento', 'edad', 'nacionalidad', 'lugardenacimiento', 'sexo', 'estadocivil')
        }),
        ('Contacto', {
            'fields': ('telefonocelular', 'telefonoconvencional', 'direccionhabitual', 'activoweb', 'email_contacto')
        }),
        ('Competencias', {
            'fields': ('funcionescompetencias',)
        }),
        ('Configuración', {
            'fields': ('public', 'idperfil', 'idperfilcomparteasociativo')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj: # Edición
            return ('idperfil', 'edad')
        return ('edad',)

@admin.register(ExperienciaLaboral)
class ExperienciaLaboralAdmin(admin.ModelAdmin):
    list_display = ('cargodesempenado', 'nombreempresa', 'fechainiciocontrato', 'mostrar_fecha_fin', 'trabajo_actual', 'public')
    search_fields = ('cargodesempenado', 'nombreempresa')
    list_filter = ('public', 'trabajo_actual')
    date_hierarchy = 'fechainiciocontrato'
    fieldsets = (
        ('Información Laboral', {
            'fields': ('cargodesempenado', 'nombreempresa', 'lugarempresa', 'fechainiciocontrato', 'fechafincontrato', 'trabajo_actual')
        }),
        ('Contacto Empresarial', {
            'fields': ('telefonocelularempresarial', 'telefonoconvencionalempresarial', 
                      'nombrecontactoprincipalempresarial', 'telefonocontactoempresarial')
        }),
        ('Descripción', {
            'fields': ('descripcionfunciones',)
        }),
        ('Adicional', {
            'fields': ('sueldocertificado',)
        }),
        ('Configuración', {
            'fields': ('public', 'idexperiencialaboral', 'idperfilcomparteasociativo')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj: # Edición
            return ('idexperiencialaboral',)
        return ()
    
    def mostrar_fecha_fin(self, obj):
        if obj.trabajo_actual:
            return "Actualidad"
        return obj.fechafincontrato if obj.fechafincontrato else "-"
    
    mostrar_fecha_fin.short_description = "Fecha Fin"

    class Media:
        js = ('js/admin/experiencia_laboral.js',)

@admin.register(ProductosAcademicos)
class ProductosAcademicosAdmin(admin.ModelAdmin):
    list_display = ('nombrerecurso', 'clasificador', 'public')
    search_fields = ('nombrerecurso', 'clasificador')
    list_filter = ('clasificador', 'public')
    fieldsets = (
        ('Información del Producto', {
            'fields': ('nombrerecurso', 'clasificador', 'descripcion')
        }),
        ('Configuración', {
            'fields': ('public', 'idproductoacademico', 'idperfilcomparteasociativo')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj: # Edición
            return ('idproductoacademico',)
        return ()

@admin.register(ProductosLaborales)
class ProductosLaboralesAdmin(admin.ModelAdmin):
    list_display = ('nombreproducto', 'fechaproducto', 'estadoproducto', 'public')
    search_fields = ('nombreproducto', 'lugarproducto')
    list_filter = ('estadoproducto', 'public')
    date_hierarchy = 'fechaproducto'
    fieldsets = (
        ('Información del Producto', {
            'fields': ('nombreproducto', 'fechaproducto', 'lugarproducto', 'estadoproducto')
        }),
        ('Detalles', {
            'fields': ('descripcion', 'valordelibro', 'imagen', 'link_proyecto')
        }),
        ('Configuración', {
            'fields': ('public', 'idproductolaboral', 'idperfilcomparteasociativo')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj: # Edición
            return ('idproductolaboral',)
        return ()

@admin.register(CursosRealizado)
class CursosRealizadoAdmin(admin.ModelAdmin):
    list_display = ('nombrecurso', 'fechainicio', 'mostrar_fecha_fin', 'en_curso', 'totalhoras', 'public', 'ver_certificado')
    search_fields = ('nombrecurso', 'entidadpatrocinadora')
    list_filter = ('public', 'en_curso')
    date_hierarchy = 'fechainicio'
    fieldsets = (
        ('Información del Curso', {
            'fields': ('nombrecurso', 'fechainicio', 'fechafin', 'en_curso', 'totalhoras', 'descripcioncurso')
        }),
        ('Entidad Patrocinadora', {
            'fields': ('entidadpatrocinadora', 'nombrereconocimientoasignado', 
                      'telefonocontactoasignado', 'emailempresapatrocinadora')
        }),
        ('Certificado', {
            'fields': ('notacertificado', 'rutacertificado')
        }),
        ('Configuración', {
            'fields': ('public', 'idcursorealizado', 'idperfilcomparteasociativo')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj: # Edición
            return ('idcursorealizado',)
        return ()
    
    def ver_certificado(self, obj):
        if obj.rutacertificado:
            return format_html('<a href="{}" target="_blank">Ver certificado</a>', obj.rutacertificado.url)
        return "No disponible"
    
    def mostrar_fecha_fin(self, obj):
        if obj.en_curso:
            return "En curso"
        return obj.fechafin if obj.fechafin else "-"
    
    mostrar_fecha_fin.short_description = "Fecha Fin"
    ver_certificado.short_description = "Certificado"
    
    class Media:
        js = ('js/admin/cursos_realizados.js',)

@admin.register(Reconocimientos)
class ReconocimientosAdmin(admin.ModelAdmin):
    list_display = ('tiporeconocimiento', 'tipo', 'fechareconocimiento', 'entidadpatrocinadora', 'public', 'ver_reconocimiento')
    search_fields = ('tiporeconocimiento', 'entidadpatrocinadora')
    list_filter = ('tipo', 'public')
    date_hierarchy = 'fechareconocimiento'
    fieldsets = (
        ('Información del Reconocimiento', {
            'fields': ('tipo', 'tiporeconocimiento', 'fechareconocimiento', 'descripcionreconocimiento')
        }),
        ('Entidad Patrocinadora', {
            'fields': ('entidadpatrocinadora', 'nombrecontactoasignado', 
                      'telefonocontactoasignado', 'emailcontacto')
        }),
        ('Certificado', {
            'fields': ('notacertificado', 'rutareconocimiento')
        }),
        ('Configuración', {
            'fields': ('public', 'idreconocimiento', 'idperfilcomparteasociativo')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj: # Edición
            return ('idreconocimiento',)
        return ()
    
    def ver_reconocimiento(self, obj):
        if obj.rutareconocimiento:
            return format_html('<a href="{}" target="_blank">Ver reconocimiento</a>', obj.rutareconocimiento.url)
        return "No disponible"
    
    ver_reconocimiento.short_description = "Reconocimiento"

@admin.register(Educacion)
class EducacionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'institucion', 'fecha_inicio', 'mostrar_fecha_fin', 'en_curso', 'public', 'ver_titulo')
    search_fields = ('titulo', 'institucion')
    list_filter = ('nivel_titulo', 'en_curso', 'public')
    date_hierarchy = 'fecha_inicio'
    fieldsets = (
        ('Información Académica', {
            'fields': ('titulo', 'institucion', 'ubicacion', 'email')
        }),
        ('Periodo', {
            'fields': ('fecha_inicio', 'fecha_fin', 'en_curso')
        }),
        ('Detalles', {
            'fields': ('descripcion', 'area_conocimiento', 'nivel_titulo', 'subarea_conocimiento')
        }),
        ('Título', {
            'fields': ('rutatitulo',)
        }),
        ('Configuración', {
            'fields': ('public', 'ideducacion', 'idperfilcomparteasociativo')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj: # Edición
            return ('ideducacion',)
        return ()
    
    def ver_titulo(self, obj):
        if obj.rutatitulo:
            return format_html('<a href="{}" target="_blank">Ver título</a>', obj.rutatitulo.url)
        return "No disponible"
    
    def mostrar_fecha_fin(self, obj):
        if obj.en_curso:
            return "En curso"
        return obj.fecha_fin if obj.fecha_fin else "-"
    
    mostrar_fecha_fin.short_description = "Fecha Fin"
    ver_titulo.short_description = "Título"
    
    class Media:
        js = ('js/admin/educacion.js',)

@admin.register(ProductoGaraje)
class ProductoGarajeAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'estado', 'fecha_publicacion', 'activo', 'ver_imagen', 'ver_contacto')
    search_fields = ('nombre', 'descripcion')
    list_filter = ('estado', 'activo')
    date_hierarchy = 'fecha_publicacion'
    fieldsets = (
        ('Información del Producto', {
            'fields': ('nombre', 'descripcion', 'precio', 'estado')
        }),
        ('Imagen y Contacto', {
            'fields': ('imagen', 'link_contacto')
        }),
        ('Configuración', {
            'fields': ('activo',)
        }),
    )
    
    def ver_imagen(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 5px;" />', obj.imagen.url)
        return "Sin imagen"
    
    def ver_contacto(self, obj):
        return format_html('<a href="{}" target="_blank">Contacto</a>', obj.link_contacto)
    
    ver_imagen.short_description = "Imagen"
    ver_contacto.short_description = "Contacto"