# 💾 Diseño de Base de Datos

## Schema MySQL Completo

### 1. Tabla: usuarios
```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    rol ENUM('admin', 'editor', 'viewer') DEFAULT 'editor',
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
- `id`: Identificador único
- `username`: Usuario para login
- `email`: Correo electrónico
- `password_hash`: Contraseña hasheada con bcrypt
- `rol`: Nivel de permisos (admin puede todo)
- `activo`: Si la cuenta está habilitada
- `ultimo_acceso`: Tracking de actividad

---

### 2. Tabla: servicios
```sql
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    icono VARCHAR(50) DEFAULT 'fas fa-briefcase',
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orden (orden),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
- `titulo`: Nombre del servicio (ej: "Laboral Administrativo")
- `descripcion`: Texto descriptivo
- `icono`: Clase de Font Awesome
- `orden`: Para ordenar en el frontend
- `activo`: Mostrar/ocultar sin eliminar

---

### 3. Tabla: categorias
```sql
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#1a3a52',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Categorías predefinidas:**
- Laboral Administrativo
- Contencioso Administrativo
- Derecho Disciplinario
- Derecho Civil
- General

---

### 4. Tabla: publicaciones
```sql
CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    contenido LONGTEXT NOT NULL,
    extracto TEXT,
    categoria_id INT NOT NULL,
    autor_id INT NOT NULL,
    imagen_url VARCHAR(255),
    estado ENUM('borrador', 'publicado', 'archivado') DEFAULT 'borrador',
    vistas INT DEFAULT 0,
    fecha_publicacion TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_slug (slug),
    INDEX idx_categoria (categoria_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_publicacion (fecha_publicacion),
    FULLTEXT idx_busqueda (titulo, contenido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos importantes:**
- `slug`: URL amigable (ej: "derechos-laborales-2024")
- `extracto`: Resumen para listados
- `estado`: Control de publicación
- `vistas`: Contador de popularidad

---

### 5. Tabla: testimonios
```sql
CREATE TABLE testimonios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    calificacion DECIMAL(2,1) CHECK (calificacion >= 0 AND calificacion <= 5),
    texto TEXT NOT NULL,
    avatar_url VARCHAR(255),
    cargo VARCHAR(100),
    empresa VARCHAR(100),
    aprobado BOOLEAN DEFAULT false,
    destacado BOOLEAN DEFAULT false,
    orden INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_aprobado (aprobado),
    INDEX idx_destacado (destacado),
    INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
- `calificacion`: 4.8 o 5.0 (decimal para precisión)
- `aprobado`: Admin debe aprobar antes de mostrar
- `destacado`: Para mostrar en homepage
- `orden`: Control de visualización

---

### 6. Tabla: consultas
```sql
CREATE TABLE consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    mensaje TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    estado ENUM('pendiente', 'en_proceso', 'atendido', 'cancelado') DEFAULT 'pendiente',
    notas_internas TEXT,
    atendido_por INT NULL,
    fecha_atencion TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (atendido_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_email (email),
    INDEX idx_fecha_creacion (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos de seguridad:**
- `ip_address`: Para prevenir spam
- `user_agent`: Tracking de origen

---

### 7. Tabla: citas
```sql
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consulta_id INT NULL,
    nombre_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(100) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL,
    servicio_id INT NULL,
    fecha_hora DATETIME NOT NULL,
    duracion_minutos INT DEFAULT 60,
    estado ENUM('solicitada', 'confirmada', 'completada', 'cancelada', 'no_asistio') DEFAULT 'solicitada',
    notas TEXT,
    recordatorio_enviado BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE SET NULL,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE SET NULL,
    INDEX idx_fecha_hora (fecha_hora),
    INDEX idx_estado (estado),
    INDEX idx_email (email_cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Funcionalidad:**
- Vincula con consultas previas
- Control de estados del proceso
- Sistema de recordatorios

---

### 8. Tabla: configuracion (Opcional)
```sql
CREATE TABLE configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo ENUM('texto', 'numero', 'booleano', 'json') DEFAULT 'texto',
    descripcion TEXT,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clave (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Uso:**
- Configuraciones dinámicas sin código
- Email del despacho, teléfono, horarios
- Redes sociales, Google Analytics

---

## Datos Iniciales (Seeds)

### Usuario Administrador por Defecto
```sql
INSERT INTO usuarios (username, email, password_hash, nombre_completo, rol)
VALUES ('admin', 'admin@despachojuridico.com', '$2a$10$...', 'Administrador', 'admin');
-- Password: admin123 (cambiar en producción)
```

### Servicios Iniciales
```sql
INSERT INTO servicios (titulo, descripcion, icono, orden) VALUES
('Laboral Administrativo', 'Defensa en despidos injustificados...', 'fas fa-briefcase', 1),
('Contencioso Administrativo', 'Procesos contra entidades públicas...', 'fas fa-landmark', 2),
('Derecho Disciplinario', 'Defensa en procesos disciplinarios...', 'fas fa-gavel', 3),
('Derecho Civil', 'Contratos, obligaciones...', 'fas fa-file-contract', 4),
('Asesoría Integral', 'Consultoría jurídica permanente...', 'fas fa-handshake', 5);
```

### Categorías Iniciales
```sql
INSERT INTO categorias (nombre, slug, color) VALUES
('Laboral Administrativo', 'laboral', '#1a3a52'),
('Contencioso Administrativo', 'contencioso', '#2c5f7f'),
('Derecho Disciplinario', 'disciplinario', '#3d7fa8'),
('Derecho Civil', 'civil', '#4e9fc9'),
('General', 'general', '#d4a574');
```

---

## Relaciones Importantes

### Diagrama ER Simplificado
```
usuarios (1) ----< (N) publicaciones
categorias (1) ----< (N) publicaciones
consultas (1) ----< (1) citas
servicios (1) ----< (N) citas
```

### Integridad Referencial
- `ON DELETE RESTRICT`: No permite eliminar si hay referencias
- `ON DELETE SET NULL`: Setea NULL al eliminar
- `ON DELETE CASCADE`: Elimina registros relacionados

---

## Índices y Performance

### Índices Creados
- **PRIMARY KEY**: Todas las tablas (id)
- **UNIQUE**: username, email, slug
- **INDEX**: Campos frecuentes en WHERE/ORDER BY
- **FULLTEXT**: Búsqueda de texto en publicaciones

### Recomendaciones
- Analizar queries lentas con `EXPLAIN`
- Crear índices compuestos si es necesario
- Monitorear tamaño de tablas

---

## Backup y Mantenimiento

### Backup Diario Automatizado
```bash
mysqldump -u root -p lawyers_db > backup_$(date +%F).sql
```

### Limpieza de Datos Antiguos
```sql
-- Eliminar consultas atendidas de hace más de 1 año
DELETE FROM consultas 
WHERE estado = 'atendido' 
AND fecha_atencion < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

---

## Próximo Paso
→ Revisar **03-api-endpoints.md** para ver cómo interactuar con estas tablas
