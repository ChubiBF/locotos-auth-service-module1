-- Módulo: Gestión de Usuarios, Perfiles y Accesos

CREATE DATABASE IF NOT EXISTS StreamingDB_Identity;
USE StreamingDB_Identity;

-- 1. Tabla de Usuarios (Credenciales y Seguridad)
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE, -- Unique para evitar correos duplicados
    password_hash VARCHAR(255) NOT NULL, -- Almacenamiento seguro de contraseñas 
    tipo_usuario ENUM('cliente', 'admin') DEFAULT 'cliente', --
    estado ENUM('activo', 'suspendido', 'pendiente_verificacion') DEFAULT 'pendiente_verificacion',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP, --
    INDEX (correo) -- Optimiza la búsqueda durante el login
) ENGINE=InnoDB;

-- 2. Tabla de Clasificaciones (Maestra para Control Parental)
CREATE TABLE IF NOT EXISTS Clasificacion_Edad (
    id_clasificacion INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE, -- Ej: 'G', 'PG-13', 'R'
    descripcion TEXT,
    edad_minima INT NOT NULL
) ENGINE=InnoDB;

-- 3. Tabla de Perfiles
CREATE TABLE IF NOT EXISTS Perfil (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(255),
    id_clasificacion_maxima INT DEFAULT 1, -- Para restricción de edad 
    idioma_preferido VARCHAR(5) DEFAULT 'es-BO',
    modo_oscuro BOOLEAN DEFAULT TRUE, -- Modo Oscuro
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_perfil_usuario FOREIGN KEY (id_usuario) 
        REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_perfil_clasificacion FOREIGN KEY (id_clasificacion_maxima) 
        REFERENCES Clasificacion_Edad(id_clasificacion)
) ENGINE=InnoDB;

-- 4. Tabla de Sesiones (Referencia para Redis/Auth)
CREATE TABLE IF NOT EXISTS Sesion_Usuario (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,	
    id_usuario INT NOT NULL,
    token_mfa VARCHAR(100),
    ultimo_acceso DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_origen VARCHAR(45),
    dispositivo VARCHAR(100),
    CONSTRAINT fk_sesion_usuario FOREIGN KEY (id_usuario) 
        REFERENCES Usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Datos para la clasificacion de las edadesd	
INSERT INTO Clasificacion_Edad (codigo, descripcion, edad_minima) VALUES 
('ATP', 'Apto para todo público', 0),
('13+', 'Mayores de 13 años', 13),
('16+', 'Mayores de 16 años', 16),
('18+', 'Contenido restringido para adultos', 18);