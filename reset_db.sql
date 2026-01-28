-- Script para eliminar todas las tablas existentes en la base de datos
-- Este script se ejecutará antes de las migraciones para asegurar un estado limpio

-- Desactivar restricciones de clave foránea temporalmente
SET session_replication_role = 'replica';

-- Eliminar tablas de la aplicación
DROP TABLE IF EXISTS cv_datospersonales CASCADE;
DROP TABLE IF EXISTS cv_productoslaborales CASCADE;
DROP TABLE IF EXISTS cv_productosacademicos CASCADE;
DROP TABLE IF EXISTS cv_cursosrealizado CASCADE;
DROP TABLE IF EXISTS cv_experiencialaboral CASCADE;
DROP TABLE IF EXISTS cv_reconocimientos CASCADE;
DROP TABLE IF EXISTS cv_educacion CASCADE;
DROP TABLE IF EXISTS cv_productogaraje CASCADE;

-- Eliminar tablas de Django
DROP TABLE IF EXISTS auth_group CASCADE;
DROP TABLE IF EXISTS auth_group_permissions CASCADE;
DROP TABLE IF EXISTS auth_permission CASCADE;
DROP TABLE IF EXISTS auth_user CASCADE;
DROP TABLE IF EXISTS auth_user_groups CASCADE;
DROP TABLE IF EXISTS auth_user_user_permissions CASCADE;
DROP TABLE IF EXISTS django_admin_log CASCADE;
DROP TABLE IF EXISTS django_content_type CASCADE;
DROP TABLE IF EXISTS django_migrations CASCADE;
DROP TABLE IF EXISTS django_session CASCADE;

-- Reactivar restricciones de clave foránea
SET session_replication_role = 'origin';