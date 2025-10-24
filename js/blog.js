function getPosts() {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
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

let currentFilter = 'all';

function renderPosts(filter = 'all') {
    const posts = getPosts();
    const blogPosts = document.getElementById('blogPosts');
    const emptyState = document.getElementById('emptyState');
    
    const filteredPosts = filter === 'all' 
        ? posts 
        : posts.filter(post => post.category === filter);
    
    if (filteredPosts.length === 0) {
        blogPosts.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    blogPosts.innerHTML = filteredPosts.map(post => `
        <article class="blog-post" onclick="window.location.href='post.html?id=${post.id}'">
            <div class="blog-post-header">
                <h3 class="blog-post-title">${post.title}</h3>
                <span class="blog-post-category">${getCategoryName(post.category)}</span>
            </div>
            <div class="blog-post-content">
                <p class="blog-post-excerpt">${post.content.substring(0, 200)}...</p>
                <div class="blog-post-footer">
                    <span class="blog-post-date">${new Date(post.date).toLocaleDateString('es-CO', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                    <span class="read-more">Leer más &rarr;</span>
                </div>
            </div>
        </article>
    `).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        renderPosts(filter);
    });
});

renderPosts();
