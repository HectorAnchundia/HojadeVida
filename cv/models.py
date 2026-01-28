from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from datetime import date

class DatosPersonales(models.Model):
    """Modelo para almacenar los datos personales del usuario"""
    public = models.BooleanField(default=True)
    idperfil = models.CharField(max_length=50, unique=True)
    idperfilcomparteasociativo = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='perfiles_asociados')
    descripcionperfil = models.CharField(max_length=255)
    varyingpic = models.ImageField(upload_to='perfiles/', null=True, blank=True)
    esfotoperfil = models.BooleanField(default=False)
    apellidos = models.CharField(max_length=100)
    nombres = models.CharField(max_length=100)
    ocupacion = models.CharField(max_length=100, default="Profesión", help_text="Ocupación o profesión que aparecerá debajo del nombre")
    nacionalidad = models.CharField(max_length=50)
    lugardenacimiento = models.CharField(max_length=100)
    fechanacimiento = models.DateField()
    numerocedula = models.CharField(max_length=20)
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino'), ('O', 'Otro')])
    estadocivil = models.CharField(max_length=20)
    telefonoconvencional = models.CharField(max_length=15, null=True, blank=True)
    telefonocelular = models.CharField(max_length=15)
    direccionhabitual = models.TextField()
    funcionescompetencias = models.TextField()
    activoweb = models.CharField(max_length=255, null=True, blank=True)
    email_contacto = models.EmailField(null=True, blank=True, help_text="Email que se mostrará en la sección de contacto")
    
    def __str__(self):
        return f"{self.nombres} {self.apellidos}"
    
    def clean(self):
        # Validar que la fecha de nacimiento no sea en el futuro
        if self.fechanacimiento and self.fechanacimiento > date.today():
            raise ValidationError({'fechanacimiento': 'La fecha de nacimiento no puede ser en el futuro.'})
    
    @property
    def edad(self):
        """Calcula la edad automáticamente basada en la fecha de nacimiento"""
        today = date.today()
        return today.year - self.fechanacimiento.year - ((today.month, today.day) < (self.fechanacimiento.month, self.fechanacimiento.day))

class ProductosLaborales(models.Model):
    """Modelo para almacenar productos laborales"""
    public = models.BooleanField(default=True)
    idproductolaboral = models.CharField(max_length=50, unique=True)
    idperfilcomparteasociativo = models.ForeignKey(DatosPersonales, on_delete=models.CASCADE, related_name='productos_laborales')
    nombreproducto = models.CharField(max_length=150)
    fechaproducto = models.DateField()
    lugarproducto = models.TextField()
    estadoproducto = models.CharField(max_length=50)
    descripcion = models.TextField()
    valordelibro = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # Nuevos campos para productos laborales
    imagen = models.ImageField(upload_to='productos_laborales/', null=True, blank=True, help_text="Imagen opcional del producto laboral")
    link_proyecto = models.URLField(null=True, blank=True, help_text="Enlace opcional al proyecto o demostración")
    
    def __str__(self):
        return self.nombreproducto
    
    def clean(self):
        # Validar que la fecha no sea en el futuro
        if self.fechaproducto and self.fechaproducto > date.today():
            raise ValidationError({'fechaproducto': 'La fecha del producto no puede ser en el futuro.'})

class ProductosAcademicos(models.Model):
    """Modelo para almacenar productos académicos"""
    public = models.BooleanField(default=True)
    idproductoacademico = models.CharField(max_length=50, unique=True)
    idperfilcomparteasociativo = models.ForeignKey(DatosPersonales, on_delete=models.CASCADE, related_name='productos_academicos')
    nombrerecurso = models.CharField(max_length=150)
    clasificador = models.CharField(max_length=50)
    descripcion = models.TextField()
    
    def __str__(self):
        return self.nombrerecurso

class CursosRealizado(models.Model):
    """Modelo para almacenar cursos realizados"""
    public = models.BooleanField(default=True)
    idcursorealizado = models.CharField(max_length=50, unique=True)
    idperfilcomparteasociativo = models.ForeignKey(DatosPersonales, on_delete=models.CASCADE, related_name='cursos_realizados')
    nombrecurso = models.CharField(max_length=100)
    fechainicio = models.DateField()
    fechafin = models.DateField()
    en_curso = models.BooleanField(default=False, help_text="Marcar si el curso está actualmente en progreso")
    totalhoras = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    descripcioncurso = models.TextField()
    entidadpatrocinadora = models.CharField(max_length=100)
    nombrereconocimientoasignado = models.CharField(max_length=100)
    telefonocontactoasignado = models.CharField(max_length=15)
    emailempresapatrocinadora = models.EmailField()
    notacertificado = models.CharField(max_length=50, null=True, blank=True)
    rutacertificado = models.FileField(upload_to='certificados/', null=True, blank=True)
    
    def __str__(self):
        return self.nombrecurso
    
    def clean(self):
        # Validar que la fecha de inicio no sea después de la fecha de fin
        if self.fechainicio and self.fechafin and not self.en_curso and self.fechainicio > self.fechafin:
            raise ValidationError({'fechainicio': 'La fecha de inicio no puede ser posterior a la fecha de fin.'})
        
        # Validar que las fechas no sean en el futuro
        today = date.today()
        if self.fechainicio and self.fechainicio > today:
            raise ValidationError({'fechainicio': 'La fecha de inicio no puede ser en el futuro.'})
        if self.fechafin and not self.en_curso and self.fechafin > today:
            raise ValidationError({'fechafin': 'La fecha de fin no puede ser en el futuro.'})

class ExperienciaLaboral(models.Model):
    """Modelo para almacenar experiencia laboral"""
    public = models.BooleanField(default=True)
    idexperiencialaboral = models.CharField(max_length=50, unique=True)
    idperfilcomparteasociativo = models.ForeignKey(DatosPersonales, on_delete=models.CASCADE, related_name='experiencias_laborales')
    cargodesempenado = models.CharField(max_length=100)
    nombreempresa = models.CharField(max_length=100)
    lugarempresa = models.CharField(max_length=100)
    telefonocelularempresarial = models.CharField(max_length=15, null=True, blank=True)
    telefonoconvencionalempresarial = models.CharField(max_length=15, null=True, blank=True)
    nombrecontactoprincipalempresarial = models.CharField(max_length=100)
    telefonocontactoempresarial = models.CharField(max_length=15)
    fechainiciocontrato = models.DateField()
    fechafincontrato = models.DateField(null=True, blank=True)
    trabajo_actual = models.BooleanField(default=False, help_text="Marcar si es el trabajo actual (hasta la actualidad)")
    descripcionfunciones = models.TextField()
    sueldocertificado = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"{self.cargodesempenado} en {self.nombreempresa}"
    
    def clean(self):
        # Validar que la fecha de inicio no sea después de la fecha de fin
        if self.fechainiciocontrato and self.fechafincontrato and not self.trabajo_actual and self.fechainiciocontrato > self.fechafincontrato:
            raise ValidationError({'fechainiciocontrato': 'La fecha de inicio no puede ser posterior a la fecha de fin.'})
        
        # Validar que las fechas no sean en el futuro
        today = date.today()
        if self.fechainiciocontrato and self.fechainiciocontrato > today:
            raise ValidationError({'fechainiciocontrato': 'La fecha de inicio no puede ser en el futuro.'})
        if self.fechafincontrato and not self.trabajo_actual and self.fechafincontrato > today:
            raise ValidationError({'fechafincontrato': 'La fecha de fin no puede ser en el futuro.'})
            
        # Si es trabajo actual, no debe tener fecha de fin
        if self.trabajo_actual and self.fechafincontrato:
            raise ValidationError({'trabajo_actual': 'Si es el trabajo actual, no debe tener fecha de fin.'})
            
        # Si no es trabajo actual, debe tener fecha de fin
        if not self.trabajo_actual and not self.fechafincontrato:
            raise ValidationError({'fechafincontrato': 'Si no es el trabajo actual, debe tener fecha de fin.'})
            
        # Verificar que solo haya un trabajo marcado como actual
        if self.trabajo_actual and self.pk is None:  # Solo para nuevos registros
            trabajos_actuales = ExperienciaLaboral.objects.filter(
                idperfilcomparteasociativo=self.idperfilcomparteasociativo,
                trabajo_actual=True
            )
            if trabajos_actuales.exists():
                raise ValidationError({'trabajo_actual': 'Ya existe un trabajo marcado como actual. Solo puede haber uno.'})

class Reconocimientos(models.Model):
    """Modelo para almacenar reconocimientos y logros"""
    TIPO_CHOICES = [
        ('general', 'General'),
        ('laboral', 'Laboral'),
    ]
    
    public = models.BooleanField(default=True)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='general')
    idreconocimiento = models.CharField(max_length=50, unique=True)
    idperfilcomparteasociativo = models.ForeignKey(DatosPersonales, on_delete=models.CASCADE, related_name='reconocimientos')
    tiporeconocimiento = models.CharField(max_length=50)
    fechareconocimiento = models.DateField()
    descripcionreconocimiento = models.TextField()
    entidadpatrocinadora = models.CharField(max_length=100)
    nombrecontactoasignado = models.CharField(max_length=100)
    telefonocontactoasignado = models.CharField(max_length=15)
    emailcontacto = models.EmailField(null=True, blank=True)
    notacertificado = models.CharField(max_length=50, null=True, blank=True)
    rutareconocimiento = models.FileField(upload_to='reconocimientos/', null=True, blank=True)
    
    def __str__(self):
        return self.tiporeconocimiento
    
    def clean(self):
        # Validar que la fecha no sea en el futuro
        today = date.today()
        if self.fechareconocimiento and self.fechareconocimiento > today:
            raise ValidationError({'fechareconocimiento': 'La fecha del reconocimiento no puede ser en el futuro.'})
        
        # Validar que la fecha no sea anterior a 10 años antes de la edad del perfil
        if self.fechareconocimiento and self.idperfilcomparteasociativo:
            perfil = self.idperfilcomparteasociativo
            fecha_minima = date(perfil.fechanacimiento.year + 10, perfil.fechanacimiento.month, perfil.fechanacimiento.day)
            if self.fechareconocimiento < fecha_minima:
                raise ValidationError({'fechareconocimiento': 'La fecha del reconocimiento no puede ser anterior a 10 años después de la fecha de nacimiento.'})

class Educacion(models.Model):
    """Modelo para almacenar educación y formación académica"""
    public = models.BooleanField(default=True)
    ideducacion = models.CharField(max_length=50, unique=True)
    idperfilcomparteasociativo = models.ForeignKey(DatosPersonales, on_delete=models.CASCADE, related_name='educacion')
    titulo = models.CharField(max_length=100)
    institucion = models.CharField(max_length=100)
    ubicacion = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    en_curso = models.BooleanField(default=False)
    descripcion = models.TextField(null=True, blank=True)
    area_conocimiento = models.CharField(max_length=100, null=True, blank=True)
    nivel_titulo = models.CharField(max_length=50, null=True, blank=True)
    subarea_conocimiento = models.CharField(max_length=100, null=True, blank=True)
    rutatitulo = models.FileField(upload_to='titulos/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.titulo} - {self.institucion}"
    
    def clean(self):
        # Validar que la fecha de inicio no sea después de la fecha de fin
        if self.fecha_inicio and self.fecha_fin and not self.en_curso and self.fecha_inicio > self.fecha_fin:
            raise ValidationError({'fecha_inicio': 'La fecha de inicio no puede ser posterior a la fecha de fin.'})
        
        # Validar que las fechas no sean en el futuro
        today = date.today()
        if self.fecha_inicio and self.fecha_inicio > today:
            raise ValidationError({'fecha_inicio': 'La fecha de inicio no puede ser en el futuro.'})
        if self.fecha_fin and not self.en_curso and self.fecha_fin > today:
            raise ValidationError({'fecha_fin': 'La fecha de fin no puede ser en el futuro.'})
        
        # Si está en curso, no debe tener fecha de fin
        if self.en_curso and self.fecha_fin:
            raise ValidationError({'en_curso': 'Si la educación está en curso, no debe tener fecha de fin.'})
        
        # Si no está en curso, debe tener fecha de fin
        if not self.en_curso and not self.fecha_fin:
            raise ValidationError({'fecha_fin': 'Si la educación no está en curso, debe tener fecha de fin.'})

class ProductoGaraje(models.Model):
    """Modelo para almacenar productos de la venta de garaje"""
    ESTADO_CHOICES = [
        ('bueno', 'Bueno'),
        ('regular', 'Regular'),
    ]
    
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='productos_garaje/', null=True, blank=True)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='bueno')
    link_contacto = models.URLField(help_text="URL para contactar al vendedor")
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        ordering = ['-fecha_publicacion']
        verbose_name = "Producto de Garaje"
        verbose_name_plural = "Productos de Garaje"