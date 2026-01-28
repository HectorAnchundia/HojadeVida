from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0003_cursosrealizado_en_curso_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='cursosrealizado',
            name='certificado_url',
            field=models.URLField(blank=True, help_text='Si prefieres, puedes ingresar directamente la URL del certificado (ej: Cloudinary)', null=True, verbose_name='URL directa del certificado'),
        ),
        migrations.AddField(
            model_name='datospersonales',
            name='varyingpic_url',
            field=models.URLField(blank=True, help_text='Si prefieres, puedes ingresar directamente la URL de una imagen (ej: Cloudinary)', null=True, verbose_name='URL directa de imagen de perfil'),
        ),
        migrations.AddField(
            model_name='educacion',
            name='titulo_url',
            field=models.URLField(blank=True, help_text='Si prefieres, puedes ingresar directamente la URL del título (ej: Cloudinary)', null=True, verbose_name='URL directa del título'),
        ),
        migrations.AddField(
            model_name='productogaraje',
            name='imagen_url',
            field=models.URLField(blank=True, help_text='Si prefieres, puedes ingresar directamente la URL de una imagen (ej: Cloudinary)', null=True, verbose_name='URL directa de imagen'),
        ),
        migrations.AddField(
            model_name='productoslaborales',
            name='imagen_url',
            field=models.URLField(blank=True, help_text='Si prefieres, puedes ingresar directamente la URL de una imagen (ej: Cloudinary)', null=True, verbose_name='URL directa de imagen'),
        ),
        migrations.AddField(
            model_name='reconocimientos',
            name='reconocimiento_url',
            field=models.URLField(blank=True, help_text='Si prefieres, puedes ingresar directamente la URL del reconocimiento (ej: Cloudinary)', null=True, verbose_name='URL directa del reconocimiento'),
        ),
    ]