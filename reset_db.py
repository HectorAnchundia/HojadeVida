#!/usr/bin/env python
"""
Script para resetear la base de datos en Render
Este script elimina todas las tablas existentes para permitir una migración limpia
"""

import os
import psycopg2
from urllib.parse import urlparse

def reset_database():
    """Elimina todas las tablas de la base de datos"""
    # Obtener la URL de la base de datos desde las variables de entorno
    database_url = os.environ.get('DATABASE_URL', 'postgresql://post:iatr1ETbfhyldkqSohxkYRGE7METODZi@dpg-d5ql12f5r7bs738n22r0-a/dbhojavida')
    
    # Parsear la URL de la base de datos
    parsed_url = urlparse(database_url)
    
    # Extraer los componentes de la conexión
    dbname = parsed_url.path[1:]  # Eliminar la barra inicial
    user = parsed_url.username
    password = parsed_url.password
    host = parsed_url.hostname
    port = parsed_url.port or 5432
    
    print(f"Conectando a la base de datos {dbname} en {host}...")
    
    try:
        # Conectar a la base de datos
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Desactivar restricciones de clave foránea temporalmente
        cursor.execute("SET session_replication_role = 'replica';")
        
        # Obtener todas las tablas públicas
        cursor.execute("""
            SELECT tablename FROM pg_tables WHERE schemaname = 'public';
        """)
        tables = cursor.fetchall()
        
        # Eliminar cada tabla
        for table in tables:
            table_name = table[0]
            print(f"Eliminando tabla: {table_name}")
            cursor.execute(f'DROP TABLE IF EXISTS "{table_name}" CASCADE;')
        
        # Reactivar restricciones de clave foránea
        cursor.execute("SET session_replication_role = 'origin';")
        
        print("Base de datos reseteada con éxito.")
        
        # Cerrar la conexión
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error al resetear la base de datos: {e}")
        # No fallamos el script para que el despliegue pueda continuar
        # incluso si hay problemas con el reseteo de la base de datos

if __name__ == "__main__":
    reset_database()