# 🔗 Integración Frontend-Backend

## Migración de localStorage a API

### Fase 1: Configuración Base

#### 1.1 Crear archivo de configuración API
**Archivo: `js/config.js`**
```javascript
const CONFIG = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://api.despachojuridico.com/api',
  
  // Timeout para peticiones
  REQUEST_TIMEOUT: 10000,
  
  // Reintentos automáticos
  MAX_RETRIES: 3
};
```

#### 1.2 Crear clase ApiService
**Archivo: `js/apiService.js`**
```javascript
class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${CONFIG.API_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Agregar token si está autenticado
    const token = AuthService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Manejar error de autenticación
        if (response.status === 401) {
          AuthService.logout();
          throw new Error('Sesión expirada');
        }
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos HTTP
  static get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  static post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  static put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  static delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
```

---

## Fase 2: Migrar Servicios

### Actualizar `index.html`
```html
<!-- Agregar scripts antes de body -->
<script src="js/config.js"></script>
<script src="js/apiService.js"></script>
<script src="js/auth.js"></script>
<script>
  // Cargar servicios desde API
  async function cargarServicios() {
    try {
      const response = await ApiService.get('/servicios');
      const servicios = response.data;

      const container = document.querySelector('.services-grid');
      container.innerHTML = '';

      servicios.forEach(servicio => {
        const card = `
          <div class="service-card">
            <div class="service-icon">
              <i class="${servicio.icono}"></i>
            </div>
            <h3>${servicio.titulo}</h3>
            <p>${servicio.descripcion}</p>
          </div>
        `;
        container.innerHTML += card;
      });

      // Iniciar animaciones
      observeServices();

    } catch (error) {
      console.error('Error cargando servicios:', error);
      // Fallback: mostrar mensaje de error
      document.querySelector('.services-grid').innerHTML = 
        '<p>Error cargando servicios. Intenta más tarde.</p>';
    }
  }

  // Cargar al inicio
  document.addEventListener('DOMContentLoaded', cargarServicios);
</script>
```

---

## Fase 3: Migrar Blog

### Actualizar `js/blog.js`
```javascript
// ANTES: Obtenía posts de localStorage
// AHORA: Obtiene desde API

async function cargarPublicaciones(categoria = 'all') {
  try {
    // Construir URL con filtros
    let endpoint = '/publicaciones?limit=10';
    if (categoria !== 'all') {
      endpoint += `&categoria=${categoria}`;
    }

    const response = await ApiService.get(endpoint);
    const { publicaciones, pagination } = response.data;

    renderPublicaciones(publicaciones);
    renderPaginacion(pagination);

  } catch (error) {
    console.error('Error cargando publicaciones:', error);
    showError('Error cargando publicaciones');
  }
}

function renderPublicaciones(publicaciones) {
  const container = document.getElementById('blog-posts');
  
  if (publicaciones.length === 0) {
    container.innerHTML = '<p class="text-center">No hay publicaciones.</p>';
    return;
  }

  container.innerHTML = publicaciones.map(post => `
    <article class="blog-post-card">
      ${post.imagen_url ? `<img src="${post.imagen_url}" alt="${post.titulo}">` : ''}
      <div class="post-content">
        <span class="category">${post.categoria.nombre}</span>
        <h2><a href="post.html?slug=${post.slug}">${post.titulo}</a></h2>
        <p>${post.extracto}</p>
        <div class="post-meta">
          <span><i class="far fa-user"></i> ${post.autor}</span>
          <span><i class="far fa-calendar"></i> ${formatearFecha(post.fecha_publicacion)}</span>
          <span><i class="far fa-eye"></i> ${post.vistas} vistas</span>
        </div>
        <a href="post.html?slug=${post.slug}" class="btn-leer-mas">Leer más</a>
      </div>
    </article>
  `).join('');
}

function renderPaginacion(pagination) {
  const container = document.getElementById('pagination');
  const { page, totalPages } = pagination;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '<div class="pagination">';
  
  // Botón anterior
  if (page > 1) {
    html += `<button onclick="cambiarPagina(${page - 1})">Anterior</button>`;
  }

  // Números de página
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === page ? 'active' : ''}" onclick="cambiarPagina(${i})">${i}</button>`;
  }

  // Botón siguiente
  if (page < totalPages) {
    html += `<button onclick="cambiarPagina(${page + 1})">Siguiente</button>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Filtros de categoría
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active')?.classList.remove('active');
    btn.classList.add('active');
    
    const categoria = btn.dataset.category;
    cargarPublicaciones(categoria);
  });
});
```

---

## Fase 4: Migrar Panel Admin

### Actualizar `js/admin.js`
```javascript
// Verificar autenticación al cargar
requireAuth();
requireAdmin();

// Mostrar datos del usuario
const user = AuthService.getCurrentUser();
document.getElementById('adminName').textContent = user.nombre_completo || user.username;

// --- SERVICIOS ---

async function cargarServiciosAdmin() {
  try {
    const response = await ApiService.get('/servicios/admin');
    const servicios = response.data;

    const tbody = document.querySelector('#serviciosTable tbody');
    tbody.innerHTML = servicios.map(servicio => `
      <tr>
        <td>${servicio.id}</td>
        <td><i class="${servicio.icono}"></i> ${servicio.titulo}</td>
        <td>${servicio.descripcion.substring(0, 50)}...</td>
        <td>${servicio.orden}</td>
        <td>
          <span class="badge ${servicio.activo ? 'badge-success' : 'badge-danger'}">
            ${servicio.activo ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td>
          <button onclick="editarServicio(${servicio.id})" class="btn-edit">Editar</button>
          <button onclick="eliminarServicio(${servicio.id})" class="btn-delete">Eliminar</button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error:', error);
    alert('Error cargando servicios');
  }
}

async function crearServicio(datos) {
  try {
    await ApiService.post('/servicios', datos);
    alert('Servicio creado exitosamente');
    cargarServiciosAdmin();
    cerrarModal();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function eliminarServicio(id) {
  if (!confirm('¿Eliminar este servicio?')) return;

  try {
    await ApiService.delete(`/servicios/${id}`);
    alert('Servicio eliminado');
    cargarServiciosAdmin();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// --- PUBLICACIONES ---

async function cargarPublicacionesAdmin() {
  try {
    const response = await ApiService.get('/publicaciones/admin?limit=50');
    const publicaciones = response.data.publicaciones;

    renderPublicacionesTable(publicaciones);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function crearPublicacion(e) {
  e.preventDefault();

  const formData = {
    titulo: document.getElementById('titulo').value,
    contenido: document.getElementById('contenido').value,
    extracto: document.getElementById('extracto').value,
    categoria_id: parseInt(document.getElementById('categoria').value),
    estado: document.getElementById('estado').value,
    imagen_url: document.getElementById('imagen').value || null
  };

  try {
    await ApiService.post('/publicaciones', formData);
    alert('Publicación creada exitosamente');
    e.target.reset();
    cargarPublicacionesAdmin();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function eliminarPublicacion(id) {
  if (!confirm('¿Eliminar esta publicación?')) return;

  try {
    await ApiService.delete(`/publicaciones/${id}`);
    alert('Publicación eliminada');
    cargarPublicacionesAdmin();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// --- CONSULTAS ---

async function cargarConsultas(estado = 'all') {
  try {
    let endpoint = '/consultas?limit=20';
    if (estado !== 'all') {
      endpoint += `&estado=${estado}`;
    }

    const response = await ApiService.get(endpoint);
    const consultas = response.data.consultas;

    renderConsultasTable(consultas);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function cambiarEstadoConsulta(id, nuevoEstado) {
  try {
    await ApiService.put(`/consultas/${id}/estado`, {
      estado: nuevoEstado,
      notas_internas: prompt('Notas internas (opcional):')
    });
    
    alert('Estado actualizado');
    cargarConsultas();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  cargarServiciosAdmin();
  cargarPublicacionesAdmin();
  cargarConsultas();
});
```

---

## Fase 5: Formulario de Contacto

### Actualizar `contact.html`
```javascript
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    mensaje: document.getElementById('mensaje').value
  };

  try {
    const response = await ApiService.post('/consultas', formData);
    
    alert('¡Consulta enviada exitosamente! Nos pondremos en contacto pronto.');
    e.target.reset();

  } catch (error) {
    alert('Error enviando consulta: ' + error.message);
  }
});
```

---

## Fase 6: Testimonios

### Actualizar sección de testimonios en `index.html`
```javascript
async function cargarTestimonios() {
  try {
    const response = await ApiService.get('/testimonios');
    const testimonios = response.data;

    const carousel = document.getElementById('testimoniosCarousel');
    
    // Crear slides (2 testimonios por slide)
    let slides = [];
    for (let i = 0; i < testimonios.length; i += 2) {
      const slide = `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <div class="row">
            ${renderTestimonio(testimonios[i])}
            ${testimonios[i + 1] ? renderTestimonio(testimonios[i + 1]) : ''}
          </div>
        </div>
      `;
      slides.push(slide);
    }

    carousel.querySelector('.carousel-inner').innerHTML = slides.join('');

  } catch (error) {
    console.error('Error cargando testimonios:', error);
  }
}

function renderTestimonio(testimonio) {
  return `
    <div class="col-md-6">
      <div class="testimonial-card" data-bs-toggle="modal" data-bs-target="#testimonialModal" 
           onclick="mostrarTestimonioCompleto(${JSON.stringify(testimonio).replace(/"/g, '&quot;')})">
        <div class="testimonial-header">
          <img src="${testimonio.avatar_url}" alt="${testimonio.nombre}">
          <div>
            <h5>${testimonio.nombre}</h5>
            <p class="position">${testimonio.cargo} - ${testimonio.empresa}</p>
            <div class="rating">
              ${'<i class="fas fa-star"></i>'.repeat(Math.floor(testimonio.calificacion))}
              ${testimonio.calificacion % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
            </div>
          </div>
        </div>
        <p class="testimonial-text">${testimonio.texto.substring(0, 100)}...</p>
      </div>
    </div>
  `;
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', cargarTestimonios);
```

---

## Fase 7: Manejo de Errores Global

### Crear `js/errorHandler.js`
```javascript
// Interceptar errores de red
window.addEventListener('unhandledrejection', (event) => {
  console.error('Error no manejado:', event.reason);
  
  // Mostrar mensaje amigable al usuario
  if (event.reason.message === 'Failed to fetch') {
    showNotification('Error de conexión. Verifica tu internet.', 'error');
  }
});

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// CSS para notificaciones (agregar a styles.css)
/*
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transform: translateX(400px);
  transition: transform 0.3s ease;
  z-index: 10000;
}

.notification.show {
  transform: translateX(0);
}

.notification-success { background: #4caf50; color: white; }
.notification-error { background: #f44336; color: white; }
.notification-info { background: #2196f3; color: white; }
*/
```

---

## Fase 8: Optimizaciones

### 8.1 Caché de Datos
```javascript
class CacheService {
  static cache = {};

  static set(key, data, ttl = 300000) { // 5 minutos por defecto
    this.cache[key] = {
      data,
      expiry: Date.now() + ttl
    };
  }

  static get(key) {
    const cached = this.cache[key];
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      delete this.cache[key];
      return null;
    }
    
    return cached.data;
  }

  static clear() {
    this.cache = {};
  }
}

// Uso en ApiService
static async get(endpoint, useCache = true) {
  if (useCache) {
    const cached = CacheService.get(endpoint);
    if (cached) return cached;
  }

  const data = await this.request(endpoint, { method: 'GET' });
  
  if (useCache) {
    CacheService.set(endpoint, data);
  }
  
  return data;
}
```

### 8.2 Loading States
```javascript
function showLoading() {
  document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

// Agregar a HTML
<div id="loading" style="display:none;">
  <div class="spinner"></div>
</div>
```

---

## Orden de Archivos en HTML

```html
<!-- En todas las páginas -->
<script src="js/config.js"></script>
<script src="js/errorHandler.js"></script>
<script src="js/apiService.js"></script>
<script src="js/auth.js"></script>

<!-- En páginas específicas -->
<script src="js/blog.js"></script>
<script src="js/admin.js"></script>
```

---

## Próximo Paso
→ Revisar **06-deployment.md** para desplegar en producción
