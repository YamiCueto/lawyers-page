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
- ✅ Formulario de contacto con validación
- ✅ Paleta de colores corporativa (azul oscuro + beige)
- ✅ Optimizado para SEO básico

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive sin frameworks
- **JavaScript Vanilla** - Funcionalidad sin dependencias
- **LocalStorage** - Persistencia de datos en navegador

## 📁 Estructura del Proyecto

```
lawyers-page/
├── index.html          # Página principal
├── blog.html           # Blog jurídico
├── contact.html        # Contacto
├── login.html          # Login administrativo
├── admin.html          # Panel de gestión
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   ├── auth.js         # Autenticación
│   ├── admin.js        # CRUD de publicaciones
│   └── blog.js         # Visualización del blog
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
