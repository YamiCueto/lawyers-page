# 🏗️ Arquitectura General del Sistema

## Stack Tecnológico Completo

### Frontend (Actual)
- **HTML5 + CSS3 + JavaScript Vanilla**
- **Bootstrap 5.3.2** - Componentes UI
- **Font Awesome 6.4.0** - Iconografía
- **LocalStorage** - Persistencia temporal (a reemplazar)

### Backend (A implementar)
- **Node.js v18+** - Runtime JavaScript
- **Express.js 4.x** - Framework web
- **MySQL 8.0+** - Base de datos relacional
- **JWT** - Autenticación stateless

### Herramientas Adicionales
- **Nodemailer** - Envío de emails
- **Multer** - Upload de archivos
- **Bcrypt** - Hash de contraseñas
- **Dotenv** - Variables de entorno
- **Express Validator** - Validación de datos

---

## Estructura del Proyecto Completo

```
lawyers-page-fullstack/
│
├── frontend/                    # Cliente (actual)
│   ├── index.html
│   ├── blog.html
│   ├── contact.html
│   ├── login.html
│   ├── admin.html
│   ├── post.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── blog.js
│   │   └── post.js
│   └── assets/
│       └── images/
│
├── backend/                     # Servidor (nuevo)
│   ├── server.js               # Punto de entrada
│   ├── config/
│   │   ├── db.js              # Configuración MySQL
│   │   └── config.js          # Configuraciones generales
│   ├── routes/
│   │   ├── auth.routes.js     # Login/Register
│   │   ├── servicios.routes.js
│   │   ├── blog.routes.js
│   │   ├── testimonios.routes.js
│   │   ├── consultas.routes.js
│   │   └── citas.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── servicios.controller.js
│   │   ├── blog.controller.js
│   │   ├── testimonios.controller.js
│   │   ├── consultas.controller.js
│   │   └── citas.controller.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Servicio.js
│   │   ├── Publicacion.js
│   │   ├── Testimonio.js
│   │   ├── Consulta.js
│   │   └── Cita.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # Verificar JWT
│   │   ├── validate.middleware.js
│   │   └── upload.middleware.js
│   ├── utils/
│   │   ├── emailService.js
│   │   └── helpers.js
│   ├── package.json
│   └── .env
│
├── database/
│   ├── schema.sql              # Estructura de tablas
│   ├── seeds.sql               # Datos iniciales
│   └── migrations/             # Cambios incrementales
│
├── docs/                        # Documentación
│   ├── 01-arquitectura-general.md
│   ├── 02-base-de-datos.md
│   ├── 03-api-endpoints.md
│   ├── 04-autenticacion.md
│   ├── 05-frontend-integration.md
│   └── 06-deployment.md
│
├── .gitignore
├── Readme.md
└── docker-compose.yml          # (Opcional) Para desarrollo
```

---

## Flujo de Datos

### 1. Autenticación
```
Usuario ingresa credenciales
    ↓
Frontend POST /api/auth/login
    ↓
Backend valida con MySQL
    ↓
Genera JWT Token
    ↓
Frontend guarda token (localStorage)
    ↓
Incluye token en headers de siguientes peticiones
```

### 2. Gestión de Contenido (Admin)
```
Admin autenticado
    ↓
CRUD en panel admin
    ↓
Frontend envía petición con JWT
    ↓
Backend valida token + permisos
    ↓
Opera en MySQL
    ↓
Retorna respuesta JSON
    ↓
Frontend actualiza UI
```

### 3. Cliente Público
```
Visitante navega sitio
    ↓
Frontend solicita datos (GET)
    ↓
Backend consulta MySQL
    ↓
Retorna datos públicos (JSON)
    ↓
Frontend renderiza contenido
```

---

## Ventajas de esta Arquitectura

### ✅ Separación de Responsabilidades
- Frontend: Presentación y UX
- Backend: Lógica de negocio y seguridad
- Database: Persistencia y relaciones

### ✅ Escalabilidad
- Frontend estático (CDN)
- Backend en servidor dedicado
- DB puede escalar independiente

### ✅ Seguridad
- Contraseñas hasheadas (bcrypt)
- Tokens JWT con expiración
- Validación server-side
- SQL injection protection

### ✅ Mantenibilidad
- Código modular y organizado
- Fácil agregar features
- Testing independiente

---

## Hosting Recomendado

### Opción 1: Todo en uno (Railway.app)
- ✅ Gratis hasta cierto uso
- ✅ Deploy automático desde Git
- ✅ MySQL incluido
- ✅ HTTPS automático

### Opción 2: Separado
- **Frontend**: GitHub Pages / Vercel (gratis)
- **Backend**: Railway / Render ($5-10/mes)
- **Database**: PlanetScale (MySQL gratis) / AWS RDS

### Opción 3: VPS Tradicional
- DigitalOcean Droplet ($6/mes)
- Todo en un servidor
- Más control, más responsabilidad

---

## Próximos Pasos

1. ✅ Leer arquitectura general (este documento)
2. → Revisar diseño de base de datos
3. → Entender endpoints de la API
4. → Implementar autenticación
5. → Integrar frontend con backend
6. → Desplegar en producción
