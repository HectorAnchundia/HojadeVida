# Hoja de Vida - Sistema de Gestión de CV

Sistema web para la gestión de hojas de vida profesionales, con exportación a PDF y múltiples secciones para mostrar experiencia, formación académica, productos laborales y más.

## Características

- Gestión completa de datos personales
- Secciones para experiencia laboral
- Registro de formación académica y cursos
- Productos académicos y laborales
- Reconocimientos y logros
- Exportación a PDF personalizable
- Interfaz responsive y moderna

## Tecnologías

- Django 3.2
- PostgreSQL
- JavaScript (Vanilla JS)
- HTML5 / CSS3
- jsPDF para exportación de documentos

## Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/hojadevida.git
cd hojadevida
```

2. Instalar dependencias
```bash
pip install -r requirements.txt
```

3. Configurar la base de datos
```bash
python manage.py migrate
```

4. Crear un superusuario
```bash
python manage.py createsuperuser
```

5. Iniciar el servidor de desarrollo
```bash
python manage.py runserver
```

## Despliegue

Este proyecto está configurado para ser desplegado en Render.com con una base de datos PostgreSQL.

## Licencia

Este proyecto está bajo la licencia MIT.