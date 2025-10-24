# 🚀 Deployment - Guía Completa de Despliegue

## Estrategia de Despliegue

### Opción Recomendada: Arquitectura Híbrida

```
Frontend Estático           Backend + Base de Datos
(GitHub Pages)              (Railway / Render)
      |                            |
      |---- API Calls (HTTPS) ---->|
      |<--- JSON Responses --------|
```

**Ventajas:**
- ✅ Frontend gratis en GitHub Pages
- ✅ Backend escalable independiente
- ✅ HTTPS automático en ambos
- ✅ CDN global para estáticos

---

## Fase 1: Preparar el Frontend

### 1.1 Actualizar URLs de Producción

**Editar `js/config.js`:**
```javascript
const CONFIG = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://api.despachojuridico.com/api', // ← Cambiar por tu URL real
  
  REQUEST_TIMEOUT: 10000,
  MAX_RETRIES: 3
};
```

### 1.2 Build Checklist

- [ ] Validar todos los enlaces (href absolutos → relativos)
- [ ] Optimizar imágenes (WebP, compresión)
- [ ] Minificar CSS/JS (opcional, GitHub Pages puede servir sin minificar)
- [ ] Remover console.logs de producción
- [ ] Actualizar meta tags (SEO)

### 1.3 Archivo `.gitignore` para Frontend
```bash
# Node modules si usas build tools
node_modules/

# Archivos de configuración local
.env.local

# Archivos temporales
.DS_Store
Thumbs.db

# Archivos de IDE
.vscode/
.idea/
```

### 1.4 Configurar GitHub Pages

**Opción A: Desde Settings**
1. Ve a tu repo → Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` / `root`
4. Save

**Opción B: Con GitHub Actions** (más control)

Crear `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

**URL final:** `https://YamiCueto.github.io/lawyers-page`

---

## Fase 2: Preparar el Backend

### 2.1 Estructura de Proyecto Backend

```bash
mkdir backend
cd backend
npm init -y
```

### 2.2 Instalar Dependencias

```bash
npm install express mysql2 cors dotenv bcrypt jsonwebtoken express-validator
npm install --save-dev nodemon
```

### 2.3 `package.json` Configurado

```json
{
  "name": "lawyers-backend",
  "version": "1.0.0",
  "description": "Backend API para despacho jurídico",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 2.4 `server.js` Punto de Entrada

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/servicios', require('./routes/servicios.routes'));
app.use('/api/publicaciones', require('./routes/blog.routes'));
app.use('/api/testimonios', require('./routes/testimonios.routes'));
app.use('/api/consultas', require('./routes/consultas.routes'));
app.use('/api/citas', require('./routes/citas.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
```

### 2.5 Archivo `.env` de Producción

```bash
# Base de datos
DB_HOST=containers-us-west-123.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_generado
DB_NAME=railway

# JWT
JWT_SECRET=8f7a9d2c4e1b6f3a8d9e2c4b7f1a6d3e
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=https://yamicueto.github.io

# Servidor
NODE_ENV=production
PORT=3000
```

### 2.6 `.gitignore` para Backend

```bash
node_modules/
.env
.env.production
.env.local

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

---

## Fase 3: Desplegar Backend en Railway

### 3.1 Crear Cuenta y Proyecto

1. Ve a [Railway.app](https://railway.app)
2. Sign up con GitHub
3. New Project → Deploy from GitHub repo
4. Selecciona tu repositorio (o crea uno para backend)

### 3.2 Configurar Variables de Entorno

En Railway Dashboard:
1. Variables → Raw Editor
2. Pega el contenido de `.env`
3. Deploy

### 3.3 Agregar Base de Datos MySQL

1. En tu proyecto → New → Database → MySQL
2. Railway genera credenciales automáticamente
3. Copia las variables:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

4. Actualiza variables de entorno del backend:
```bash
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
```

### 3.4 Conectar a MySQL Remoto

Usa Railway CLI o cliente MySQL:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar a MySQL
railway connect MySQL
```

**O con MySQL Workbench:**
- Host: `containers-us-west-123.railway.app`
- Port: `3306`
- User: `root`
- Password: (de variables de entorno)

### 3.5 Importar Schema

```bash
mysql -h containers-us-west-123.railway.app -u root -p railway < database/schema.sql
mysql -h containers-us-west-123.railway.app -u root -p railway < database/seeds.sql
```

### 3.6 Dominio Personalizado (Opcional)

En Railway → Settings → Domains:
1. Generate Domain: `lawyers-backend-production.up.railway.app`
2. O conectar dominio propio: `api.despachojuridico.com`

**Para dominio propio:**
- Agrega CNAME en tu DNS: `api → lawyers-backend-production.up.railway.app`
- Espera propagación DNS (5-30 min)

---

## Fase 4: Alternativa - Render.com

### 4.1 Crear Servicio

1. [Render.com](https://render.com) → New Web Service
2. Conectar repo de GitHub
3. Configurar:
   - **Name:** lawyers-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 4.2 Variables de Entorno

En Environment:
```bash
NODE_ENV=production
JWT_SECRET=tu_secreto
# ... resto de variables
```

### 4.3 Base de Datos MySQL Externa

Render no incluye MySQL gratis. Opciones:

**A) PlanetScale (Recomendado - MySQL Serverless)**
1. [PlanetScale.com](https://planetscale.com)
2. Create Database
3. Obtener connection string
4. Agregar a Render como variable `DATABASE_URL`

**B) Railway MySQL + Render Backend**
- Usar Railway solo para DB
- Render solo para API

---

## Fase 5: Alternativa - VPS (DigitalOcean)

### 5.1 Crear Droplet

1. DigitalOcean → Create Droplet
2. Ubuntu 22.04 LTS
3. Plan: Basic $6/mes
4. Datacenter: Más cercano a tus usuarios

### 5.2 Configuración Inicial

```bash
# Conectar por SSH
ssh root@tu_ip

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar MySQL
apt install -y mysql-server

# Configurar firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Instalar PM2 (gestor de procesos)
npm install -g pm2

# Instalar Nginx (reverse proxy)
apt install -y nginx
```

### 5.3 Configurar MySQL

```bash
mysql_secure_installation

mysql -u root -p
```

```sql
CREATE DATABASE lawyers_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lawyersuser'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON lawyers_db.* TO 'lawyersuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5.4 Desplegar Backend

```bash
# Crear usuario para la app
adduser --disabled-password lawyerapp

# Clonar repositorio
cd /home/lawyerapp
git clone https://github.com/YamiCueto/lawyers-backend.git
cd lawyers-backend

# Instalar dependencias
npm install --production

# Crear archivo .env
nano .env
# (pegar configuración)

# Iniciar con PM2
pm2 start server.js --name lawyers-api
pm2 startup
pm2 save
```

### 5.5 Configurar Nginx

```bash
nano /etc/nginx/sites-available/lawyers-api
```

```nginx
server {
    listen 80;
    server_name api.despachojuridico.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Activar sitio
ln -s /etc/nginx/sites-available/lawyers-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 5.6 Certificado SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.despachojuridico.com
```

---

## Fase 6: Monitoreo y Mantenimiento

### 6.1 Health Checks

**En Railway/Render:**
- Configurar Health Check Path: `/health`
- Restart on failure: Enabled

**Script de monitoreo (opcional):**
```bash
#!/bin/bash
ENDPOINT="https://api.despachojuridico.com/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $ENDPOINT)

if [ $RESPONSE != 200 ]; then
    echo "API down! Status: $RESPONSE"
    # Enviar alerta (email, Slack, etc.)
fi
```

### 6.2 Logs

**Railway:**
```bash
railway logs
```

**Render:**
- Ver en dashboard

**PM2 (VPS):**
```bash
pm2 logs lawyers-api
pm2 monit
```

### 6.3 Backups de Base de Datos

**Automatizado (cron):**
```bash
crontab -e
```

```bash
# Backup diario a las 2 AM
0 2 * * * mysqldump -u root -p'password' lawyers_db > /backups/db_$(date +\%F).sql
```

**PlanetScale:**
- Backups automáticos incluidos
- Restore desde dashboard

---

## Fase 7: Optimizaciones

### 7.1 CDN para Assets

Usar Cloudflare (gratis):
1. Agregar dominio a Cloudflare
2. Cambiar nameservers
3. Habilitar proxy (nube naranja)
4. SSL: Full (strict)

### 7.2 Compresión

**Backend (Express):**
```javascript
const compression = require('compression');
app.use(compression());
```

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 7.3 Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de requests
});

app.use('/api/', apiLimiter);
```

---

## Resumen de Costos

### Opción 1: Gratis (Testing)
- Frontend: GitHub Pages → **$0**
- Backend: Railway Hobby → **$0** (500h/mes)
- DB: Railway MySQL → **$0** (limitado)
**Total: $0/mes**

### Opción 2: Producción Pequeña
- Frontend: GitHub Pages → **$0**
- Backend: Render Starter → **$7/mes**
- DB: PlanetScale Scaler → **$0** (10GB)
**Total: $7/mes**

### Opción 3: Producción Profesional
- Frontend: Vercel Pro → **$20/mes**
- Backend: Railway Pro → **$10/mes**
- DB: Railway MySQL → **$5/mes**
**Total: $35/mes**

### Opción 4: VPS Completo
- DigitalOcean Droplet → **$6/mes**
- Dominio (.com) → **$12/año**
**Total: $7/mes**

---

## Checklist Final de Deployment

- [ ] Backend desplegado y respondiendo en `/health`
- [ ] Base de datos creada e inicializada (schema + seeds)
- [ ] Variables de entorno configuradas
- [ ] Frontend apunta a URL correcta de backend
- [ ] CORS configurado con origen correcto
- [ ] HTTPS habilitado en ambos lados
- [ ] Primer usuario admin creado
- [ ] Backups de DB programados
- [ ] Monitoreo configurado
- [ ] DNS configurado (si usas dominio propio)
- [ ] Certificados SSL renovación automática

---

## Troubleshooting Común

### Error: CORS blocked
- Verifica `FRONTEND_URL` en `.env` del backend
- Confirma `cors()` configuración en `server.js`

### Error: Database connection failed
- Revisa credenciales en variables de entorno
- Verifica que DB esté corriendo
- Chequea firewall/whitelist de IPs

### Error: 502 Bad Gateway
- Backend no está corriendo
- Puerto incorrecto en configuración
- Revisa logs: `railway logs` o `pm2 logs`

### Frontend carga pero no trae datos
- Abre DevTools → Network
- Verifica URLs de las peticiones
- Confirma que backend responde en esa URL

---

🎉 **¡Listo!** Tu sitio ahora está completamente funcional en producción.
