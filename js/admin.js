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

    document.getElementById('totalPosts').textContent = posts.length;
    document.getElementById('todayPosts').textContent = todayPosts.length;
}

// Renderizar tabla de publicaciones
function renderPosts(postsToRender = null) {
    const posts = postsToRender || getPosts();
    allPosts = posts;
    const tbody = document.getElementById('postsTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (posts.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
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
    closePostModal();
});

// Editar publicación
function editPost(id) {
    openPostModal(id);
}

// Eliminar publicación
function deletePost(id) {
    const post = allPosts.find(p => p.id === id);
    
    if (confirm(`¿Está seguro de eliminar "${post.title}"?\n\nEsta acción no se puede deshacer.`)) {
        const posts = getPosts();
        const updatedPosts = posts.filter(p => p.id !== id);
        savePosts(updatedPosts);
        renderPosts();
        updateStats();
        showNotification('Publicación eliminada', 'success');
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
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }
});

// Inicializar
renderPosts();
updateStats();

