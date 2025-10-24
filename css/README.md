# Estructura de Estilos CSS - Despacho Jurídico

Este proyecto utiliza una arquitectura modular de CSS para mejorar el mantenimiento y la escalabilidad.

## 📁 Estructura de Archivos

```
css/
├── base.css              # Variables CSS, reset y utilidades básicas
├── components.css        # Componentes reutilizables (botones, badges, formularios)
├── login.css            # Estilos específicos de la página de login
├── admin-layout.css     # Layout del panel de administración (topbar, sidebar)
├── dashboard.css        # Dashboard y widgets de estadísticas
├── admin-tables.css     # Tablas, filtros y elementos de gestión
├── modals.css           # Modales y color picker
└── styles-new.css       # Archivo principal con imports (reemplazará styles.css)
```

## 🎯 Propósito de Cada Archivo

### **base.css**
- Variables CSS globales (colores, espaciado)
- Reset de estilos
- Contenedor principal
- Clases utilitarias (`.hidden`)

### **components.css**
- Botones (`.btn`, `.btn-primary`, `.btn-icon`)
- Badges de categorías
- Formularios y campos de entrada
- Search box
- Sistema de notificaciones

### **login.css**
- Layout de split-screen
- Panel de branding izquierdo
- Formulario de login
- Animaciones de login
- Responsive para móviles

### **admin-layout.css**
- Topbar fija superior
- Sidebar de navegación
- Layout principal con flexbox
- Estructura de secciones
- Contenido placeholder
- Responsive sidebar (colapsa en móvil)

### **dashboard.css**
- Tarjetas de estadísticas principales
- Grid de widgets
- Tablas de widgets
- Gráficos de categorías
- Feed de actividad
- Lista de reseñas

### **admin-tables.css**
- Filtros y búsqueda
- Tablas de administración
- Celdas especiales (categorías, colores)
- Estado vacío
- Responsive tables

### **modals.css**
- Estructura de modales
- Encabezado y footer
- Color picker
- Animaciones de modal
- Tamaños de modal (`.modal-small`)

## 🔧 Uso en HTML

### Para páginas de administración (admin.html)
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/admin-layout.css">
<link rel="stylesheet" href="css/dashboard.css">
<link rel="stylesheet" href="css/admin-tables.css">
<link rel="stylesheet" href="css/modals.css">
```

### Para página de login (login.html)
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/login.css">
```

### Para páginas públicas (index.html, blog.html)
```html
<link rel="stylesheet" href="css/styles.css">
<!-- O usar styles-new.css cuando migremos completamente -->
```

## 🎨 Variables CSS Disponibles

```css
--primary-color: #1a3a52;      /* Azul principal */
--secondary-color: #c8a97e;    /* Dorado secundario */
--white: #ffffff;
--light-bg: #f8f9fa;
--border-color: #e0e0e0;
--text-color: #333333;
--text-light: #666666;
```

## 📦 Componentes Reutilizables

### Botones
- `.btn` - Botón base
- `.btn-primary` - Botón principal (azul)
- `.btn-secondary` - Botón secundario (dorado)
- `.btn-danger` - Botón de peligro (rojo)
- `.btn-icon` - Botón circular de icono

### Badges
- `.badge-laboral` - Azul
- `.badge-contencioso` - Morado
- `.badge-disciplinario` - Rojo
- `.badge-civil` - Verde azulado
- `.badge-general` - Gris

### Formularios
- `.form-group` - Grupo de campo de formulario
- `.search-box` - Caja de búsqueda con icono

## 🚀 Ventajas de esta Estructura

1. **Mantenimiento más fácil**: Cada archivo tiene un propósito específico
2. **Carga selectiva**: Solo cargar los estilos necesarios para cada página
3. **Mejor organización**: Código más legible y estructurado
4. **Escalabilidad**: Fácil agregar nuevos módulos
5. **Colaboración**: Varios desarrolladores pueden trabajar en archivos diferentes
6. **Performance**: Posibilidad de optimizar carga con CSS crítico

## 🔄 Migración desde styles.css

El archivo `styles.css` original contiene ~2000 líneas. Ahora está dividido en:
- base.css (~40 líneas)
- components.css (~200 líneas)
- login.css (~180 líneas)
- admin-layout.css (~200 líneas)
- dashboard.css (~300 líneas)
- admin-tables.css (~150 líneas)
- modals.css (~150 líneas)

## 📝 Notas

- Los estilos públicos (header, footer, hero, servicios) permanecen en `styles-new.css`
- Se puede continuar usando `styles.css` como fallback durante la transición
- Todos los nuevos desarrollos deben usar la estructura modular

## 🎯 Próximos Pasos

1. ✅ Crear archivos modulares
2. ✅ Actualizar admin.html y login.html
3. ⏳ Migrar páginas públicas (index.html, blog.html, contact.html)
4. ⏳ Eliminar styles.css antiguo
5. ⏳ Renombrar styles-new.css a styles.css
