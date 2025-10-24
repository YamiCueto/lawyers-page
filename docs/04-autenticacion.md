# 🔐 Sistema de Autenticación

## Flujo Completo de Autenticación

### 1. Arquitectura JWT (JSON Web Tokens)

```
Cliente               Backend                  Base de Datos
   |                     |                           |
   |--[1] POST /login--> |                           |
   |   {user, pass}      |                           |
   |                     |--[2] Consulta usuario--->|
   |                     |<--[3] Datos usuario------|
   |                     |                           |
   |                     |--[4] Verifica bcrypt      |
   |                     |                           |
   |<--[5] {token}-------|                           |
   |                     |                           |
   |--[6] GET /api/... ->|                           |
   | Header: Bearer token|                           |
   |                     |--[7] Verifica token       |
   |                     |--[8] Query si válido----->|
   |<--[9] Respuesta-----|<--[9] Datos---------------|
```

---

## Implementación Backend

### Archivo: `backend/config/config.js`
```javascript
require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion',
    expiresIn: '7d' // Token válido por 7 días
  },
  bcrypt: {
    saltRounds: 10
  }
};
```

---

### Archivo: `backend/middleware/auth.middleware.js`
```javascript
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  // Obtener token del header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  try {
    // Verificar y decodificar token
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // Guardar info del usuario en la request
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para verificar rol de admin
const verifyAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Requiere permisos de administrador'
    });
  }
  next();
};

// Middleware combinado
const requireAdmin = [verifyToken, verifyAdmin];

module.exports = {
  verifyToken,
  verifyAdmin,
  requireAdmin
};
```

---

### Archivo: `backend/controllers/auth.controller.js`
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/config');

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar usuario en DB
    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE username = ? AND activo = true',
      [username]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último acceso
    await db.query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
      [usuario.id]
    );

    // Generar JWT token
    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Responder sin incluir password_hash
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: usuario.id,
          username: usuario.username,
          email: usuario.email,
          nombre_completo: usuario.nombre_completo,
          rol: usuario.rol
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Registrar nuevo usuario (solo admin)
exports.register = async (req, res) => {
  try {
    const { username, email, password, nombre_completo, rol } = req.body;

    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si usuario ya existe
    const [existentes] = await db.query(
      'SELECT id FROM usuarios WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existentes.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Usuario o email ya registrado'
      });
    }

    // Hash de contraseña
    const password_hash = await bcrypt.hash(password, config.bcrypt.saltRounds);

    // Insertar en DB
    const [result] = await db.query(
      `INSERT INTO usuarios (username, email, password_hash, nombre_completo, rol) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, password_hash, nombre_completo || null, rol || 'editor']
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        id: result.insertId,
        username,
        email,
        rol: rol || 'editor'
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Verificar token (ruta protegida de prueba)
exports.verify = (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    data: {
      user: req.user // Viene del middleware
    }
  });
};
```

---

### Archivo: `backend/routes/auth.routes.js`
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas
router.post('/register', verifyToken, authController.register); // Solo usuarios autenticados pueden crear usuarios
router.get('/verify', verifyToken, authController.verify);

module.exports = router;
```

---

## Integración Frontend

### Archivo: `js/auth.js` (Actualizado)
```javascript
// API Base URL
const API_URL = 'http://localhost:3000/api'; // Cambiar en producción

class AuthService {
  // Login
  static async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token en localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return { success: true, user: data.data.user };
      } else {
        return { success: false, message: data.message };
      }

    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }

  // Logout
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }

  // Verificar si está autenticado
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Obtener token
  static getToken() {
    return localStorage.getItem('token');
  }

  // Obtener usuario actual
  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Verificar si es admin
  static isAdmin() {
    const user = this.getCurrentUser();
    return user && user.rol === 'admin';
  }

  // Headers para peticiones autenticadas
  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
}

// Proteger páginas que requieren autenticación
function requireAuth() {
  if (!AuthService.isAuthenticated()) {
    window.location.href = '/login.html';
  }
}

// Proteger páginas de admin
function requireAdmin() {
  if (!AuthService.isAdmin()) {
    alert('Acceso denegado. Requiere permisos de administrador.');
    window.location.href = '/index.html';
  }
}
```

---

### Actualizar `login.html`
```javascript
// En el formulario de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const result = await AuthService.login(username, password);

  if (result.success) {
    window.location.href = '/admin.html';
  } else {
    alert(result.message || 'Error en el login');
  }
});
```

---

### Actualizar `admin.html`
```javascript
// Al inicio del archivo
requireAuth(); // Verificar autenticación
requireAdmin(); // Verificar permisos

// Mostrar info del usuario
const user = AuthService.getCurrentUser();
document.getElementById('username').textContent = user.nombre_completo || user.username;

// Botón de logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  AuthService.logout();
});
```

---

## Ejemplo: Petición Autenticada

### Crear Servicio con Token
```javascript
async function crearServicio(datos) {
  try {
    const response = await fetch(`${API_URL}/servicios`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(), // Incluye token automáticamente
      body: JSON.stringify(datos)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Servicio creado exitosamente');
      cargarServicios(); // Recargar lista
    } else {
      alert(result.message || 'Error al crear servicio');
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
}
```

---

## Seguridad Adicional

### Variables de Entorno (`.env`)
```bash
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=lawyers_db

# JWT
JWT_SECRET=8f7a9d2c4e1b6f3a8d9e2c4b7f1a6d3e
JWT_EXPIRES_IN=7d

# Email (para notificaciones)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=despacho@juridico.com
EMAIL_PASS=tu_password_email

# Entorno
NODE_ENV=development
PORT=3000
```

**Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Configuración CORS
```javascript
// En server.js
const cors = require('cors');

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tu-sitio.github.io' 
    : 'http://localhost:5500',
  credentials: true
}));
```

---

## Testing de Autenticación

### Con curl
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Usar token en petición
curl -X GET http://localhost:3000/api/servicios/admin \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Con Postman/Insomnia
1. POST `/auth/login` → Guardar token
2. Configurar "Bearer Token" en Authorization
3. Probar endpoints protegidos

---

## Próximo Paso
→ Revisar **05-frontend-integration.md** para conectar completamente el frontend con el backend
