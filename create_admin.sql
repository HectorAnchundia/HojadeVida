-- Script SQL para crear un usuario administrador en Django
-- Ejecutar este script directamente en la consola de PostgreSQL de Render

-- Primero, verificamos si el usuario ya existe
DO $$
DECLARE
    user_exists BOOLEAN;
    password_hash TEXT := 'pbkdf2_sha256$720000$XhWGdEm2xYvLMbmYQQlpTl$zKBDXQXaz9TLjh0l2+B+HtFNpvQeUxdYJLUFLm9Slv8='; -- Hash para 'Admin2024!'
    current_timestamp TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Verificar si el usuario 'admin' ya existe
    SELECT EXISTS(SELECT 1 FROM auth_user WHERE username = 'admin') INTO user_exists;
    
    IF user_exists THEN
        -- Actualizar la contraseña del usuario existente
        UPDATE auth_user 
        SET password = password_hash,
            last_login = current_timestamp
        WHERE username = 'admin';
        
        RAISE NOTICE 'Usuario admin ya existe. Contraseña actualizada.';
    ELSE
        -- Insertar un nuevo usuario administrador
        INSERT INTO auth_user (
            password, 
            last_login,
            is_superuser, 
            username, 
            first_name, 
            last_name, 
            email, 
            is_staff, 
            is_active, 
            date_joined
        ) VALUES (
            password_hash,       -- Contraseña: Admin2024!
            current_timestamp,   -- Último login
            TRUE,                -- Es superusuario
            'admin',             -- Nombre de usuario
            'Admin',             -- Nombre
            'User',              -- Apellido
            'admin@example.com', -- Email
            TRUE,                -- Es staff
            TRUE,                -- Está activo
            current_timestamp    -- Fecha de creación
        );
        
        RAISE NOTICE 'Usuario admin creado exitosamente.';
    END IF;
END $$;