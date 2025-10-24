# 🔌 API Endpoints - Documentación Completa

## Base URL
```
Desarrollo: http://localhost:3000/api
Producción: https://api.despachojuridico.com/api
```

---

## 🔐 Autenticación

### POST /auth/register
Registrar nuevo usuario (solo admin puede crear usuarios)

**Request:**
```json
{
  "username": "juan.perez",
  "email": "juan@example.com",
  "password": "Password123!",
  "nombre_completo": "Juan Pérez",
  "rol": "editor"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 2,
    "username": "juan.perez",
    "email": "juan@example.com",
    "rol": "editor"
  }
}
```

---

### POST /auth/login
Iniciar sesión

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@despachojuridico.com",
      "rol": "admin"
    }
  }
}
```

**Headers para peticiones autenticadas:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Servicios

### GET /servicios
Listar todos los servicios activos (público)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Laboral Administrativo",
      "descripcion": "Defensa en despidos injustificados...",
      "icono": "fas fa-briefcase",
      "orden": 1
    },
    ...
  ]
}
```

---

### GET /servicios/admin
Listar todos los servicios (incluyendo inactivos) - **Requiere Auth**

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Laboral Administrativo",
      "descripcion": "...",
      "icono": "fas fa-briefcase",
      "orden": 1,
      "activo": true,
      "fecha_creacion": "2024-01-15T10:30:00Z"
    },
    ...
  ]
}
```

---

### POST /servicios
Crear nuevo servicio - **Requiere Auth Admin**

**Request:**
```json
{
  "titulo": "Derecho Penal",
  "descripcion": "Defensa penal en todos los niveles",
  "icono": "fas fa-balance-scale",
  "orden": 6,
  "activo": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Servicio creado exitosamente",
  "data": {
    "id": 6,
    "titulo": "Derecho Penal",
    ...
  }
}
```

---

### PUT /servicios/:id
Actualizar servicio - **Requiere Auth Admin**

**Request:**
```json
{
  "titulo": "Laboral y Administrativo",
  "descripcion": "Nueva descripción actualizada"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Servicio actualizado",
  "data": { ... }
}
```

---

### DELETE /servicios/:id
Eliminar servicio (soft delete) - **Requiere Auth Admin**

**Response (200):**
```json
{
  "success": true,
  "message": "Servicio eliminado"
}
```

---

## 📝 Publicaciones (Blog)

### GET /publicaciones
Listar publicaciones publicadas (público)

**Query Params:**
- `categoria`: Filtrar por slug de categoría
- `limit`: Número de resultados (default: 10)
- `page`: Página (default: 1)
- `orden`: `reciente` | `popular` (default: reciente)

**Ejemplo:**
```
GET /publicaciones?categoria=laboral&limit=5&page=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "publicaciones": [
      {
        "id": 1,
        "titulo": "Derechos laborales en Colombia 2024",
        "slug": "derechos-laborales-colombia-2024",
        "extracto": "Guía completa sobre...",
        "categoria": {
          "id": 1,
          "nombre": "Laboral Administrativo",
          "slug": "laboral"
        },
        "autor": "Dr. Juan Pérez",
        "fecha_publicacion": "2024-01-15T10:00:00Z",
        "vistas": 1523
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 23,
      "totalPages": 5
    }
  }
}
```

---

### GET /publicaciones/:slug
Obtener publicación completa por slug (público)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "Derechos laborales en Colombia 2024",
    "slug": "derechos-laborales-colombia-2024",
    "contenido": "Contenido completo de la publicación...",
    "categoria": { ... },
    "autor": {
      "nombre": "Dr. Juan Pérez",
      "email": "juan@despachojuridico.com"
    },
    "fecha_publicacion": "2024-01-15T10:00:00Z",
    "vistas": 1524
  }
}
```

---

### POST /publicaciones
Crear publicación - **Requiere Auth**

**Request:**
```json
{
  "titulo": "Nueva reforma laboral",
  "contenido": "Contenido completo aquí...",
  "extracto": "Resumen breve",
  "categoria_id": 1,
  "imagen_url": "https://...",
  "estado": "publicado"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Publicación creada",
  "data": { ... }
}
```

---

### PUT /publicaciones/:id
Actualizar publicación - **Requiere Auth**

### DELETE /publicaciones/:id
Eliminar publicación - **Requiere Auth Admin**

---

## ⭐ Testimonios

### GET /testimonios
Listar testimonios aprobados (público)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "María Rodríguez",
      "calificacion": 5.0,
      "texto": "Excelente atención...",
      "avatar_url": "https://randomuser.me/api/portraits/women/1.jpg",
      "cargo": "Gerente de RRHH",
      "empresa": "Tech Corp"
    },
    ...
  ]
}
```

---

### POST /testimonios
Crear testimonio - **Requiere Auth Admin**

**Request:**
```json
{
  "nombre": "Carlos Mendoza",
  "calificacion": 4.8,
  "texto": "Muy profesionales...",
  "avatar_url": "https://...",
  "aprobado": true,
  "destacado": false
}
```

---

### PUT /testimonios/:id/aprobar
Aprobar testimonio - **Requiere Auth Admin**

**Response (200):**
```json
{
  "success": true,
  "message": "Testimonio aprobado"
}
```

---

## 📞 Consultas (Contacto)

### POST /consultas
Enviar consulta (público)

**Request:**
```json
{
  "nombre": "Pedro García",
  "email": "pedro@example.com",
  "telefono": "+57 300 123 4567",
  "mensaje": "Necesito asesoría sobre..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Consulta enviada exitosamente. Nos pondremos en contacto pronto.",
  "data": {
    "id": 45,
    "fecha_creacion": "2024-01-20T14:30:00Z"
  }
}
```

**Nota:** Se envía email automático al despacho y al cliente.

---

### GET /consultas
Listar consultas - **Requiere Auth**

**Query Params:**
- `estado`: pendiente | en_proceso | atendido | cancelado
- `limit`: Resultados por página
- `page`: Número de página

**Response (200):**
```json
{
  "success": true,
  "data": {
    "consultas": [
      {
        "id": 45,
        "nombre": "Pedro García",
        "email": "pedro@example.com",
        "telefono": "+57 300 123 4567",
        "mensaje": "...",
        "estado": "pendiente",
        "fecha_creacion": "2024-01-20T14:30:00Z"
      },
      ...
    ],
    "pagination": { ... }
  }
}
```

---

### PUT /consultas/:id/estado
Actualizar estado de consulta - **Requiere Auth**

**Request:**
```json
{
  "estado": "atendido",
  "notas_internas": "Se atendió vía telefónica"
}
```

---

## 📅 Citas

### POST /citas
Solicitar cita (público)

**Request:**
```json
{
  "nombre_cliente": "Ana López",
  "email_cliente": "ana@example.com",
  "telefono_cliente": "+57 300 987 6543",
  "servicio_id": 1,
  "fecha_hora": "2024-02-15T10:00:00",
  "notas": "Preferiblemente horario de mañana"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Cita solicitada. Recibirás confirmación por email.",
  "data": {
    "id": 12,
    "estado": "solicitada",
    "fecha_hora": "2024-02-15T10:00:00Z"
  }
}
```

---

### GET /citas
Listar citas - **Requiere Auth**

**Query Params:**
- `estado`: solicitada | confirmada | completada | cancelada
- `fecha_desde`: ISO date
- `fecha_hasta`: ISO date

---

### PUT /citas/:id/confirmar
Confirmar cita - **Requiere Auth**

**Request:**
```json
{
  "duracion_minutos": 90,
  "notas": "Traer documentos originales"
}
```

---

## 📊 Estadísticas (Admin)

### GET /estadisticas/dashboard
Resumen general - **Requiere Auth Admin**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "consultas_pendientes": 12,
    "citas_hoy": 3,
    "publicaciones_totales": 45,
    "testimonios_pendientes": 2,
    "visitas_mes_actual": 3456
  }
}
```

---

## 🚨 Códigos de Estado HTTP

- `200 OK` - Éxito
- `201 Created` - Recurso creado
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no existe
- `500 Internal Server Error` - Error del servidor

---

## 🔒 Seguridad

### Rate Limiting
- Consultas públicas: 100 requests/15min por IP
- Auth endpoints: 5 intentos/15min
- Admin endpoints: 200 requests/15min

### Validación
- Todos los inputs son validados
- SQL injection protection (prepared statements)
- XSS protection
- CSRF tokens en formularios

---

## Próximo Paso
→ Revisar **04-autenticacion.md** para implementar el sistema de login
