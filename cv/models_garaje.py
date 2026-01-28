from django.db import models

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