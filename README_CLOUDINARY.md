# Configuración de Cloudinary para Imágenes

Este documento explica cómo configurar Cloudinary para almacenar y servir las imágenes de tu aplicación Django desplegada en Render.

## Paso 1: Crear una cuenta en Cloudinary

1. Ve a [cloudinary.com](https://cloudinary.com/users/register/free) y regístrate para obtener una cuenta gratuita
2. Una vez registrado, accede a tu dashboard de Cloudinary
3. En el dashboard, encontrarás tus credenciales:
   - Cloud Name
   - API Key
   - API Secret

## Paso 2: Configurar variables de entorno en Render

1. Ve a tu servicio web en Render
2. Ve a la pestaña "Environment"
3. Agrega las siguientes variables de entorno:

   - `CLOUDINARY_CLOUD_NAME`: Tu Cloud Name de Cloudinary
   - `CLOUDINARY_API_KEY`: Tu API Key de Cloudinary
   - `CLOUDINARY_API_SECRET`: Tu API Secret de Cloudinary

## Paso 3: Redesplegar la aplicación

1. Haz commit y push de los cambios a tu repositorio
2. Despliega la aplicación en Render

## Uso en el panel de administración

Una vez configurado, puedes subir imágenes normalmente a través del panel de administración de Django. Las imágenes se almacenarán automáticamente en Cloudinary y se servirán desde allí.

## Ventajas del plan gratuito de Cloudinary

- 25 GB de almacenamiento
- 25 GB de ancho de banda mensual
- Transformaciones de imágenes (redimensionamiento, recorte, etc.)
- CDN global para entrega rápida de imágenes
- Sin necesidad de tarjeta de crédito

## Solución de problemas

Si las imágenes no se muestran correctamente:

1. Verifica que las variables de entorno estén configuradas correctamente en Render
2. Asegúrate de que las credenciales de Cloudinary sean correctas
3. Revisa los logs de la aplicación para detectar posibles errores
4. Verifica que las URLs de las imágenes en el HTML comiencen con `https://res.cloudinary.com/`