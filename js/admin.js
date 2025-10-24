// Verificar autenticación
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Mostrar nombre de usuario
const username = localStorage.getItem('username') || 'Admin';
document.getElementById('adminUsername').textContent = username;

// Estado global
let allPosts = [];
let editingPostId = null;

// ========================================
// NAVEGACIÓN SIDEBAR
// ========================================

function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('collapsed');
}

function switchSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Actualizar links del sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Cargar datos específicos de la sección
    if (sectionName === 'dashboard') {
        loadDashboardData();
    } else if (sectionName === 'posts') {
        loadPosts();
    } else if (sectionName === 'categories') {
        renderCategories();
    }
    
    // Cerrar sidebar en móvil
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('adminSidebar');
        sidebar.classList.add('collapsed');
    }
    
    return false; // Prevenir navegación del enlace
}

// ========================================
// DASHBOARD
// ========================================

function loadDashboardData() {
    const posts = getPosts();
    const categories = getCategories();
    
    // Actualizar contadores principales
    document.getElementById('dashTotalPosts').textContent = posts.length;
    
    // Cargar publicaciones recientes en la tabla
    const recentPosts = posts.slice(-5).reverse(); // Últimas 5 publicaciones
    const tableBody = document.querySelector('#recentPostsTable tbody');
    
    if (recentPosts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">No hay publicaciones aún</td></tr>';
    } else {
        tableBody.innerHTML = recentPosts.map(post => {
            const category = categories.find(cat => cat.slug === post.category);
            const categoryName = category ? category.name : getCategoryName(post.category);
            const categoryColor = category ? category.color : '#95a5a6';
            
            return `
                <tr>
                    <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${post.title}
                    </td>
                    <td>
                        <span class="badge" style="background-color: ${categoryColor};">
                            ${categoryName}
                        </span>
                    </td>
                    <td>${new Date(post.date).toLocaleDateString('es-ES')}</td>
                    <td>
                        <span class="badge badge-success">Publicado</span>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    // Gráfico de categorías
    renderCategoryChart(posts, categories);
}

function renderCategoryChart(posts, categories) {
    const chartContainer = document.getElementById('categoryStatsChart');
    
    // Contar posts por categoría
    const categoryCount = {};
    categories.forEach(cat => {
        categoryCount[cat.slug] = posts.filter(p => p.category === cat.slug).length;
    });
    
    // Calcular total para porcentajes
    const total = Object.values(categoryCount).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
        chartContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No hay publicaciones para mostrar</p>';
        return;
    }
    
    // Crear barras horizontales
    chartContainer.innerHTML = categories.map(cat => {
        const count = categoryCount[cat.slug] || 0;
        const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
        
        return `
            <div class="category-bar-item">
                <div class="category-bar-label">
                    <span style="color: ${cat.color}; font-weight: 600;">${cat.name}</span>
                    <span>${count} (${percentage}%)</span>
                </div>
                <div class="category-bar-bg">
                    <div class="category-bar-fill" style="width: ${percentage}%; background-color: ${cat.color};"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Funciones de almacenamiento
function getPosts() {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
}

function savePosts(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function getCategoryName(category) {
    const categories = {
        'laboral': 'Laboral Administrativo',
        'contencioso': 'Contencioso Administrativo',
        'disciplinario': 'Derecho Disciplinario',
        'civil': 'Derecho Civil',
        'general': 'General'
    };
    return categories[category] || category;
}

function getCategoryBadgeClass(category) {
    const classes = {
        'laboral': 'badge-laboral',
        'contencioso': 'badge-contencioso',
        'disciplinario': 'badge-disciplinario',
        'civil': 'badge-civil',
        'general': 'badge-general'
    };
    return classes[category] || 'badge-general';
}

// Actualizar estadísticas
function updateStats() {
    const posts = getPosts();
    const today = new Date().toDateString();
    const todayPosts = posts.filter(post => 
        new Date(post.date).toDateString() === today
    );

    // Actualizar contador en dashboard si existe
    const dashTotalPosts = document.getElementById('dashTotalPosts');
    if (dashTotalPosts) {
        dashTotalPosts.textContent = posts.length;
    }
}

// Cargar sección de publicaciones
function loadPosts() {
    renderPosts();
    updateStats();
}

// Renderizar tabla de publicaciones
function renderPosts(postsToRender = null) {
    const posts = postsToRender || getPosts();
    allPosts = posts;
    const tbody = document.getElementById('postsTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (!tbody) return; // Salir si no estamos en la sección de posts
    
    if (posts.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }
    
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    
    tbody.innerHTML = posts.map(post => `
        <tr>
            <td><span class="post-id">#${post.id}</span></td>
            <td>
                <div class="post-title-cell">
                    <strong>${post.title}</strong>
                    <small>${post.content.substring(0, 80)}...</small>
                </div>
            </td>
            <td>
                <span class="badge ${getCategoryBadgeClass(post.category)}">
                    ${getCategoryName(post.category)}
                </span>
            </td>
            <td>${formatDate(post.date)}</td>
            <td>
                <div class="action-buttons">
                    <button 
                        class="btn-icon btn-edit" 
                        onclick="editPost(${post.id})"
                        title="Editar publicación"
                    >
                        <i class="fas fa-edit"></i>
                    </button>
                    <button 
                        class="btn-icon btn-delete" 
                        onclick="deletePost(${post.id})"
                        title="Eliminar publicación"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-CO', options);
}

// Filtrar publicaciones
function filterPosts() {
    const searchTerm = document.getElementById('searchPosts').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    
    let filtered = allPosts;
    
    if (categoryFilter) {
        filtered = filtered.filter(post => post.category === categoryFilter);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm)
        );
    }
    
    renderPosts(filtered);
}

// Modal functions
function openPostModal(postId = null) {
    const modal = document.getElementById('postModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtnText = document.getElementById('submitBtnText');
    const form = document.getElementById('postForm');
    
    if (postId) {
        // Modo edición
        const post = allPosts.find(p => p.id === postId);
        if (post) {
            editingPostId = postId;
            modalTitle.textContent = 'Editar Publicación';
            submitBtnText.textContent = 'Actualizar';
            
            document.getElementById('postId').value = post.id;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postCategory').value = post.category;
            document.getElementById('postContent').value = post.content;
        }
    } else {
        // Modo creación
        editingPostId = null;
        modalTitle.textContent = 'Nueva Publicación';
        submitBtnText.textContent = 'Publicar';
        form.reset();
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePostModal() {
    const modal = document.getElementById('postModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    editingPostId = null;
    document.getElementById('postForm').reset();
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    const modal = document.getElementById('postModal');
    if (e.target === modal) {
        closePostModal();
    }
});

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePostModal();
    }
});

// Crear/Editar publicación
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value;
    const posts = getPosts();
    
    if (editingPostId) {
        // Actualizar publicación existente
        const index = posts.findIndex(p => p.id === editingPostId);
        if (index !== -1) {
            posts[index] = {
                ...posts[index],
                title,
                category,
                content,
                updatedAt: new Date().toISOString()
            };
            showNotification('Publicación actualizada exitosamente', 'success');
        }
    } else {
        // Crear nueva publicación
        const newPost = {
            id: Date.now(),
            title,
            category,
            content,
            date: new Date().toISOString()
        };
        posts.unshift(newPost);
        showNotification('Publicación creada exitosamente', 'success');
    }
    
    savePosts(posts);
    renderPosts();
    updateStats();
    updateDashboardIfActive();
    closePostModal();
});

// Editar publicación
function editPost(id) {
    openPostModal(id);
}

// Eliminar publicación
function deletePost(id) {
    const post = allPosts.find(p => p.id === id);
    
    Swal.fire({
        title: '¿Eliminar publicación?',
        html: `Estás a punto de eliminar:<br><strong>"${post.title}"</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
        cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
        focusCancel: true,
        customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-btn-confirm',
            cancelButton: 'swal-btn-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const posts = getPosts();
            const updatedPosts = posts.filter(p => p.id !== id);
            savePosts(updatedPosts);
            renderPosts();
            updateStats();
            updateDashboardIfActive();
            
            Swal.fire({
                title: '¡Eliminado!',
                text: 'La publicación ha sido eliminada correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'swal-custom-popup'
                }
            });
        }
    });
}

// Actualizar dashboard si está activo
function updateDashboardIfActive() {
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection && dashboardSection.classList.contains('active')) {
        loadDashboardData();
    }
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', function() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Se cerrará tu sesión actual',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1a3a52',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: '<i class="fas fa-sign-out-alt"></i> Sí, cerrar sesión',
        cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
        customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-btn-confirm',
            cancelButton: 'swal-btn-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            
            Swal.fire({
                title: '¡Hasta pronto!',
                text: 'Sesión cerrada correctamente',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    popup: 'swal-custom-popup'
                }
            }).then(() => {
                window.location.href = 'login.html';
            });
        }
    });
});

// ========================================
// GESTIÓN DE CATEGORÍAS
// ========================================

let allCategories = [];
let editingCategoryId = null;

// Categorías por defecto
const defaultCategories = [
    {
        id: 1,
        name: 'Laboral Administrativo',
        slug: 'laboral',
        color: '#3498db',
        description: 'Defensa en despidos injustificados, reclamaciones laborales y más'
    },
    {
        id: 2,
        name: 'Contencioso Administrativo',
        slug: 'contencioso',
        color: '#9b59b6',
        description: 'Procesos contra entidades públicas'
    },
    {
        id: 3,
        name: 'Derecho Disciplinario',
        slug: 'disciplinario',
        color: '#e74c3c',
        description: 'Defensa en procesos disciplinarios'
    },
    {
        id: 4,
        name: 'Derecho Civil',
        slug: 'civil',
        color: '#1abc9c',
        description: 'Contratos, obligaciones y responsabilidad civil'
    },
    {
        id: 5,
        name: 'General',
        slug: 'general',
        color: '#95a5a6',
        description: 'Temas generales de interés jurídico'
    }
];

// Funciones de almacenamiento de categorías
function getCategories() {
    const categories = localStorage.getItem('blogCategories');
    if (!categories) {
        // Inicializar con categorías por defecto
        saveCategories(defaultCategories);
        return defaultCategories;
    }
    return JSON.parse(categories);
}

function saveCategories(categories) {
    localStorage.setItem('blogCategories', JSON.stringify(categories));
}

// Generar slug automático
function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
        .trim()
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-'); // Múltiples guiones a uno solo
}

// Auto-generar slug al escribir nombre
document.getElementById('categoryName').addEventListener('input', function(e) {
    if (!editingCategoryId) { // Solo auto-generar en modo creación
        const slug = generateSlug(e.target.value);
        document.getElementById('categorySlug').value = slug;
    }
});

// Sincronizar color picker con input de texto
document.getElementById('categoryColor').addEventListener('input', function(e) {
    document.getElementById('categoryColorText').value = e.target.value;
});

document.getElementById('categoryColorText').addEventListener('input', function(e) {
    const color = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        document.getElementById('categoryColor').value = color;
    }
});

// Renderizar tabla de categorías
function renderCategories() {
    const categories = getCategories();
    allCategories = categories;
    const tbody = document.getElementById('categoriesTableBody');
    const posts = getPosts();
    
    if (!tbody) return; // Salir si no estamos en la sección de categorías
    
    tbody.innerHTML = categories.map(cat => {
        const postCount = posts.filter(p => p.category === cat.slug).length;
        
        return `
            <tr>
                <td><span class="post-id">#${cat.id}</span></td>
                <td>
                    <div class="category-name-cell">
                        <strong>${cat.name}</strong>
                        ${cat.description ? `<small>${cat.description}</small>` : ''}
                    </div>
                </td>
                <td><code>${cat.slug}</code></td>
                <td>
                    <div class="color-preview">
                        <span class="color-box" style="background-color: ${cat.color}"></span>
                        <span>${cat.color}</span>
                    </div>
                </td>
                <td>
                    <span class="post-count">${postCount}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button 
                            class="btn-icon btn-edit" 
                            onclick="editCategory(${cat.id})"
                            title="Editar categoría"
                        >
                            <i class="fas fa-edit"></i>
                        </button>
                        <button 
                            class="btn-icon btn-delete" 
                            onclick="deleteCategory(${cat.id})"
                            title="Eliminar categoría"
                            ${postCount > 0 ? 'disabled' : ''}
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Actualizar contador en estadísticas
    document.getElementById('totalCategories').textContent = categories.length;
    
    // Actualizar selectores de categorías en publicaciones
    updateCategorySelectors();
}

// Actualizar selectores de categoría en formularios
function updateCategorySelectors() {
    const categories = getCategories();
    const selectors = [
        document.getElementById('postCategory'),
        document.getElementById('filterCategory')
    ];
    
    selectors.forEach(selector => {
        if (selector) {
            const currentValue = selector.value;
            const firstOption = selector.options[0].outerHTML;
            
            selector.innerHTML = firstOption + categories.map(cat => 
                `<option value="${cat.slug}">${cat.name}</option>`
            ).join('');
            
            selector.value = currentValue;
        }
    });
}

// Modal de categorías
function openCategoryModal(categoryId = null) {
    const modal = document.getElementById('categoryModal');
    const modalTitle = document.getElementById('categoryModalTitle');
    const submitBtnText = document.getElementById('categorySubmitBtnText');
    const form = document.getElementById('categoryForm');
    
    if (categoryId) {
        // Modo edición
        const category = allCategories.find(c => c.id === categoryId);
        if (category) {
            editingCategoryId = categoryId;
            modalTitle.textContent = 'Editar Categoría';
            submitBtnText.textContent = 'Actualizar';
            
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categorySlug').value = category.slug;
            document.getElementById('categoryColor').value = category.color;
            document.getElementById('categoryColorText').value = category.color;
            document.getElementById('categoryDescription').value = category.description || '';
        }
    } else {
        // Modo creación
        editingCategoryId = null;
        modalTitle.textContent = 'Nueva Categoría';
        submitBtnText.textContent = 'Guardar';
        form.reset();
        document.getElementById('categoryColor').value = '#1a3a52';
        document.getElementById('categoryColorText').value = '#1a3a52';
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    editingCategoryId = null;
    document.getElementById('categoryForm').reset();
}

// Crear/Editar categoría
document.getElementById('categoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('categoryName').value;
    const slug = document.getElementById('categorySlug').value;
    const color = document.getElementById('categoryColor').value;
    const description = document.getElementById('categoryDescription').value;
    
    const categories = getCategories();
    
    // Validar slug único
    const slugExists = categories.some(c => 
        c.slug === slug && c.id !== editingCategoryId
    );
    
    if (slugExists) {
        showNotification('El slug ya existe. Por favor usa otro.', 'error');
        return;
    }
    
    if (editingCategoryId) {
        // Actualizar categoría existente
        const index = categories.findIndex(c => c.id === editingCategoryId);
        if (index !== -1) {
            categories[index] = {
                ...categories[index],
                name,
                slug,
                color,
                description
            };
            showNotification('Categoría actualizada exitosamente', 'success');
        }
    } else {
        // Crear nueva categoría
        const newCategory = {
            id: Date.now(),
            name,
            slug,
            color,
            description
        };
        categories.push(newCategory);
        showNotification('Categoría creada exitosamente', 'success');
    }
    
    saveCategories(categories);
    renderCategories();
    closeCategoryModal();
});

// Editar categoría
function editCategory(id) {
    openCategoryModal(id);
}

// Eliminar categoría
function deleteCategory(id) {
    const category = allCategories.find(c => c.id === id);
    const posts = getPosts();
    const postCount = posts.filter(p => p.category === category.slug).length;
    
    if (postCount > 0) {
        Swal.fire({
            title: 'No se puede eliminar',
            html: `La categoría <strong>"${category.name}"</strong> tiene <strong>${postCount}</strong> publicación(es) asociadas.<br><br>Primero debes reasignar o eliminar esas publicaciones.`,
            icon: 'error',
            confirmButtonColor: '#1a3a52',
            confirmButtonText: '<i class="fas fa-check"></i> Entendido',
            customClass: {
                popup: 'swal-custom-popup',
                confirmButton: 'swal-btn-confirm'
            }
        });
        return;
    }
    
    Swal.fire({
        title: '¿Eliminar categoría?',
        html: `Estás a punto de eliminar:<br><strong>"${category.name}"</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
        cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
        focusCancel: true,
        customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-btn-confirm',
            cancelButton: 'swal-btn-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const categories = getCategories();
            const updatedCategories = categories.filter(c => c.id !== id);
            saveCategories(updatedCategories);
            renderCategories();
            
            Swal.fire({
                title: '¡Eliminada!',
                text: 'La categoría ha sido eliminada correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'swal-custom-popup'
                }
            });
        }
    });
}

// Cerrar modales con ESC o click fuera
document.addEventListener('click', function(e) {
    const postModal = document.getElementById('postModal');
    const categoryModal = document.getElementById('categoryModal');
    
    if (e.target === postModal) {
        closePostModal();
    }
    if (e.target === categoryModal) {
        closeCategoryModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePostModal();
        closeCategoryModal();
    }
});

// Inicializar
loadDashboardData();
updateCategorySelectors();
