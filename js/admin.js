if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

function getPosts() {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
}

function savePosts(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function renderPosts() {
    const posts = getPosts();
    const postsList = document.getElementById('postsList');
    
    if (posts.length === 0) {
        postsList.innerHTML = '<p style="text-align: center; color: #999;">No hay publicaciones aún</p>';
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-admin-item">
            <div class="post-admin-header">
                <h3 class="post-admin-title">${post.title}</h3>
                <span class="post-admin-category">${getCategoryName(post.category)}</span>
            </div>
            <div class="post-admin-content">${post.content.substring(0, 150)}...</div>
            <div class="post-admin-footer">
                <span>${new Date(post.date).toLocaleDateString('es-CO')}</span>
                <button class="btn-delete" onclick="deletePost(${post.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const categories = {
        'laboral': 'Laboral Administrativo',
        'contencioso': 'Contencioso Administrativo',
        'civil': 'Derecho Civil',
        'general': 'General'
    };
    return categories[category] || category;
}

function deletePost(id) {
    if (confirm('¿Está seguro de eliminar esta publicación?')) {
        const posts = getPosts();
        const updatedPosts = posts.filter(post => post.id !== id);
        savePosts(updatedPosts);
        renderPosts();
    }
}

document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const posts = getPosts();
    const newPost = {
        id: Date.now(),
        title: document.getElementById('postTitle').value,
        category: document.getElementById('postCategory').value,
        content: document.getElementById('postContent').value,
        date: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    savePosts(posts);
    this.reset();
    renderPosts();
    alert('Publicación creada exitosamente');
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
});

renderPosts();
