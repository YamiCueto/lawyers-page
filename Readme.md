# Despacho Jurídico - Página Web Corporativa

Sitio web profesional para despacho de abogados especializado en derecho laboral administrativo, contencioso administrativo y derecho civil. Implementado como prototipo estático funcional para validación con el cliente.

## 🔗 Demo
**[Ver sitio en vivo](https://yamicueto.github.io/lawyers-page)**

## 📋 Descripción

Página web diseñada para captar clientes potenciales mediante una presentación profesional de servicios legales. El sitio incluye sistema de gestión de contenido básico para publicaciones del blog jurídico, implementado completamente en el navegador usando localStorage.

### Características principales

- ✅ Diseño responsive optimizado para móviles, tablets y escritorio
- ✅ Sistema de autenticación para panel administrativo
- ✅ Gestión de publicaciones del blog (crear, listar, eliminar)
- ✅ Filtrado de artículos por categoría jurídica
- ✅ Visualización completa de artículos individuales
- ✅ Formulario de contacto con validación
- ✅ Sección de reseñas con carousel interactivo (Bootstrap)
- ✅ Modal para ver reseñas en detalle
- ✅ Avatares dinámicos de clientes (Random User API)
- ✅ Sistema de calificación con estrellas (5 y 4.8)
- ✅ Paleta de colores corporativa (azul oscuro + beige)
- ✅ Optimizado para SEO básico

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive sin frameworks adicionales
- **JavaScript Vanilla** - Funcionalidad sin dependencias
- **Bootstrap 5.3.2** - Sistema de carousel y modales
- **Font Awesome 6.4.0** - Iconos y sistema de estrellas
- **LocalStorage** - Persistencia de datos en navegador
- **Random User API** - Generación de avatares realistas

## 📁 Estructura del Proyecto

```
lawyers-page/
├── index.html          # Página principal con reseñas
├── blog.html           # Blog jurídico con filtros
├── contact.html        # Contacto con formulario
├── login.html          # Login administrativo
├── admin.html          # Panel de gestión
├── post.html           # Vista de artículo individual
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   ├── auth.js         # Autenticación
│   ├── admin.js        # CRUD de publicaciones
│   ├── blog.js         # Visualización del blog
│   └── post.js         # Vista individual de posts
└── assets/
    └── images/         # Recursos gráficos
```

## 🚀 Uso Local

1. Clonar el repositorio:
```bash
git clone https://github.com/YamiCueto/lawyers-page.git
cd lawyers-page
```

2. Abrir `index.html` en el navegador:
```bash
start index.html
```

No requiere instalación de dependencias ni servidor local.

## 🔐 Acceso Administrativo

Para acceder al panel de gestión de contenido:

- **URL**: `/login.html`
- **Usuario**: `admin`
- **Contraseña**: `admin123`

Desde el panel puedes crear, visualizar y eliminar publicaciones del blog.

## 📝 Áreas de Práctica

- **Laboral Administrativo** - Despidos, liquidaciones, prestaciones sociales
- **Contencioso Administrativo** - Procesos contra entidades públicas, nulidades
- **Derecho Civil** - Contratos, responsabilidad civil, arrendamientos
- **Asesoría Integral** - Consultoría jurídica para empresas y particulares

## 🎨 Paleta de Colores

```css
--primary-color: #1a3a52    /* Azul oscuro */
--secondary-color: #d4a574  /* Beige/café claro */
--text-color: #333          /* Texto principal */
--light-bg: #f8f8f8         /* Fondo claro */
```

## 📱 Responsive Design

- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⭐ Sección de Reseñas

- **10 reseñas de clientes** organizadas en carousel
- **Sistema de calificación**: 5 estrellas (50%) y 4.8 estrellas (50%)
- **Modal interactivo**: Click en cualquier reseña para ver detalle completo
- **Avatares dinámicos**: Generados con Random User API
- **Navegación**: Controles de flecha e indicadores de página

## 🔄 Próximas Mejoras

- [ ] Integración con backend (Node.js/PHP)
- [ ] Base de datos real (MySQL/MongoDB)
- [ ] Sistema de autenticación robusto (JWT)
- [ ] Editor de contenido WYSIWYG
- [ ] Galería de casos de éxito
- [ ] Integración con Google Analytics
- [ ] Mapa de Google Maps en contacto
- [ ] Chat de WhatsApp Business

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Yamid Cueto Mazo**  
Desarrollador Full Stack  
[GitHub](https://github.com/YamiCueto)

---

**Nota**: Este es un prototipo estático para validación con el cliente. Para producción se recomienda implementar backend, base de datos y medidas de seguridad adicionales.
