# Despacho Jurídico - Página Web Corporativa

Sitio web profesional para despacho de abogados especializado en derecho laboral administrativo, contencioso administrativo y derecho civil. Implementado como prototipo funcional con panel de administración completo.

## 🔗 Demo
**[Ver sitio en vivo](https://yamicueto.github.io/lawyers-page)**

## 📋 Descripción

Página web diseñada para captar clientes potenciales mediante una presentación profesional de servicios legales. El sitio incluye un **panel de administración moderno** con dashboard completo, sistema de gestión de contenido y arquitectura CSS modular para fácil mantenimiento.

### Características principales

#### Frontend Público
- ✅ Diseño responsive optimizado para móviles, tablets y escritorio
- ✅ Sección de reseñas con carousel interactivo (Bootstrap)
- ✅ Modal para ver reseñas en detalle
- ✅ Avatares dinámicos de clientes (Random User API)
- ✅ Sistema de calificación con estrellas
- ✅ Formulario de contacto con validación
- ✅ Paleta de colores corporativa (azul oscuro + dorado)
- ✅ Optimizado para SEO básico

#### Panel de Administración (NUEVO)
- ✅ **Dashboard completo** con estadísticas y widgets
- ✅ **Sidebar de navegación** lateral con 7 secciones
- ✅ **Gestión de publicaciones** con tabla, filtros y búsqueda
- ✅ **Gestión de categorías** con color picker y slugs automáticos
- ✅ **Sistema modular de CSS** (7 archivos organizados)
- ✅ **Gráficos y estadísticas** en tiempo real
- ✅ **Feed de actividad** reciente
- ✅ **Responsive** con sidebar colapsable en móvil
- ✅ **Login modernizado** con split-screen

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive con arquitectura modular
- **JavaScript Vanilla** - Funcionalidad sin dependencias
- **Bootstrap 5.3.2** - Sistema de carousel y modales
- **Font Awesome 6.4.0** - Iconos
- **LocalStorage** - Persistencia de datos en navegador

## 📁 Estructura del Proyecto

```
lawyers-page/
├── index.html              # Página principal
├── blog.html               # Blog jurídico con filtros
├── contact.html            # Contacto
├── login.html              # Login administrativo (modernizado)
├── admin.html              # Panel de gestión (nuevo diseño)
├── post.html               # Vista de artículo
├── css/
│   ├── base.css           # Variables y reset
│   ├── components.css     # Componentes reutilizables
│   ├── login.css          # Estilos de login
│   ├── admin-layout.css   # Layout del panel (sidebar/topbar)
│   ├── dashboard.css      # Dashboard y widgets
│   ├── admin-tables.css   # Tablas y filtros
│   ├── modals.css         # Modales
│   ├── styles.css         # Estilos públicos
│   └── README.md          # Documentación de CSS
├── js/
│   ├── auth.js            # Autenticación
│   ├── admin.js           # Lógica del panel
│   ├── blog.js            # Visualización del blog
│   └── post.js            # Vista individual
├── docs/                   # Documentación del backend
│   ├── 01-arquitectura-general.md
│   ├── 02-base-de-datos.md
│   ├── 03-api-endpoints.md
│   ├── 04-autenticacion.md
│   ├── 05-frontend-integration.md
│   ├── 06-deployment.md
│   └── README.md
├── assets/
│   └── images/
└── CHANGELOG-ADMIN.md      # Cambios del panel admin
```

## 🎯 Panel de Administración

### Características del Dashboard

#### 📊 Tarjetas de Estadísticas
- **Publicaciones**: Total de entradas del blog (datos reales)
- **Clientes Activos**: 248 clientes (datos de demostración)
- **Reseñas**: 156 reseñas con promedio 4.8★
- **Mensajes**: 42 mensajes nuevos

#### 📈 Widgets Informativos
1. **Publicaciones Recientes** - Tabla con las últimas 5 publicaciones
2. **Estadísticas por Categoría** - Gráfico de barras con porcentajes
3. **Feed de Actividad** - Timeline de eventos recientes
4. **Últimas Reseñas** - Lista con calificaciones y comentarios

#### 🎨 Secciones Disponibles
- **Dashboard** - Vista general con estadísticas
- **Publicaciones** - CRUD completo con tabla y modales
- **Categorías** - Gestión de categorías con color picker
- **Clientes** - Próximamente
- **Reseñas** - Próximamente
- **Mensajes** - Próximamente
- **Configuración** - Próximamente

### Sistema de Categorías

Gestión completa de categorías con:
- ✅ Nombre y descripción
- ✅ Slug automático (normalización de acentos)
- ✅ Color personalizado con picker
- ✅ Contador de publicaciones asociadas
- ✅ Validación de slugs únicos
- ✅ Protección contra eliminación si hay posts asociados

**Categorías predefinidas:**
- 🔵 Laboral Administrativo (#3498db)
- 🟣 Contencioso Administrativo (#9b59b6)
- 🔴 Derecho Disciplinario (#e74c3c)
- 🟢 Derecho Civil (#1abc9c)
- ⚪ General (#95a5a6)

## 🚀 Uso Local

1. Clonar el repositorio:
```bash
git clone https://github.com/YamiCueto/lawyers-page.git
cd lawyers-page
```

2. Abrir con Live Server o abrir directamente:
```bash
# Con Live Server (recomendado)
# Click derecho en index.html > Open with Live Server

# O abrir directamente
start index.html
```

No requiere instalación de dependencias ni servidor local.

## 🔐 Acceso Administrativo

Para acceder al panel de gestión de contenido:

- **URL**: `/login.html`
- **Usuario**: `admin`
- **Contraseña**: `admin123`

Desde el panel puedes:
- Ver dashboard con estadísticas
- Crear, editar y eliminar publicaciones
- Gestionar categorías con colores personalizados
- Filtrar y buscar contenido

## 📝 Áreas de Práctica

- **Laboral Administrativo** - Despidos, liquidaciones, prestaciones sociales
- **Contencioso Administrativo** - Procesos contra entidades públicas, nulidades
- **Derecho Disciplinario** - Defensa en procesos disciplinarios
- **Derecho Civil** - Contratos, responsabilidad civil, arrendamientos

## 🎨 Arquitectura CSS Modular

El proyecto utiliza una arquitectura CSS organizada en módulos:

```css
css/
├── base.css              # Variables, reset, utilidades
├── components.css        # Botones, badges, formularios
├── login.css            # Página de login
├── admin-layout.css     # Sidebar y topbar
├── dashboard.css        # Widgets y estadísticas
├── admin-tables.css     # Tablas y filtros
└── modals.css           # Modales y color picker
```

**Ventajas:**
- ✅ Fácil mantenimiento
- ✅ Carga selectiva por página
- ✅ Mejor organización del código
- ✅ Escalable para futuros desarrollos
- ✅ Trabajo en equipo más eficiente

Ver [css/README.md](css/README.md) para documentación completa.

## 🎨 Paleta de Colores

```css
/* Colores Principales */
--primary-color: #1a3a52;      /* Azul corporativo */
--secondary-color: #c8a97e;    /* Dorado elegante */
--white: #ffffff;
--light-bg: #f8f9fa;
--border-color: #e0e0e0;
--text-color: #333333;

/* Categorías */
Laboral: #3498db        /* Azul */
Contencioso: #9b59b6    /* Morado */
Disciplinario: #e74c3c  /* Rojo */
Civil: #1abc9c          /* Verde azulado */
General: #95a5a6        /* Gris */
```

## 📱 Responsive Design

- **Móvil**: < 768px - Sidebar colapsado, grid 1 columna
- **Tablet**: 768px - 1024px - Sidebar visible, grid adaptable
- **Desktop**: > 1024px - Vista completa con sidebar fijo

## 📊 Gestión de Datos

### LocalStorage
El proyecto utiliza localStorage para persistencia:

```javascript
// Estructura de datos
{
  "blogPosts": [...],        // Publicaciones
  "blogCategories": [...],   // Categorías
  "isLoggedIn": "true",     // Estado de sesión
  "username": "admin"       // Usuario activo
}
```

### Datos de Demostración
- **Posts reales**: Creados por el administrador
- **Clientes**: 248 (dummy)
- **Reseñas**: 156 con promedio 4.8★ (dummy)
- **Mensajes**: 42 nuevos (dummy)

## 📚 Documentación Backend

El proyecto incluye documentación completa en la carpeta `/docs`:

1. **Arquitectura General** - Visión técnica del sistema
2. **Base de Datos** - Esquema MySQL con relaciones
3. **API Endpoints** - REST API completo
4. **Autenticación** - Sistema JWT con refresh tokens
5. **Frontend Integration** - Guía de integración
6. **Deployment** - Estrategias de despliegue

## 🔄 Changelog

### v2.0.0 - Panel de Administración Modernizado (2025-10-24)

#### ✨ Nuevas Características
- Panel de administración con sidebar lateral
- Dashboard completo con estadísticas y widgets
- Sistema de gestión de categorías con color picker
- Arquitectura CSS modular (7 archivos)
- Login rediseñado con split-screen
- Navegación mejorada con 7 secciones

#### 🔧 Mejoras Técnicas
- Separación de estilos en módulos
- Funciones JavaScript optimizadas
- Validaciones de seguridad en renderizado
- Sistema de actualización condicional del dashboard
- Documentación completa del CSS

Ver [CHANGELOG-ADMIN.md](CHANGELOG-ADMIN.md) para detalles completos.

## � Próximas Mejoras

### Corto Plazo
- [ ] Implementar secciones placeholder (Clientes, Reseñas, Mensajes)
- [ ] Editor WYSIWYG para contenido
- [ ] Sistema de imágenes para publicaciones
- [ ] Exportar estadísticas a PDF/Excel

### Medio Plazo
- [ ] Integración con backend (Node.js/Express)
- [ ] Base de datos real (MySQL/MongoDB)
- [ ] Autenticación JWT robusta
- [ ] API REST completa
- [ ] Sistema de roles y permisos

### Largo Plazo
- [ ] Galería de casos de éxito
- [ ] Integración con Google Analytics
- [ ] Chat de WhatsApp Business
- [ ] Sistema de citas online
- [ ] Blog con comentarios
- [ ] SEO avanzado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Yamid Cueto Mazo**  
Desarrollador Full Stack  
[GitHub](https://github.com/YamiCueto)

---

## 📝 Notas Técnicas

- **Versión actual**: 2.0.0
- **Última actualización**: Octubre 24, 2025
- **Navegadores soportados**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Resolución mínima**: 320px (móviles pequeños)

**Nota**: Este es un prototipo funcional para validación. Para producción se recomienda implementar backend, base de datos y medidas de seguridad adicionales según documentación en `/docs`.
