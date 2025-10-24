function getPostById(id) {
    const posts = localStorage.getItem('blogPosts');
    if (!posts) return null;
    const allPosts = JSON.parse(posts);
    return allPosts.find(post => post.id === parseInt(id));
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

function renderPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        showNotFound();
        return;
    }
    
    const post = getPostById(postId);
    
    if (!post) {
        showNotFound();
        return;
    }
    
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postCategory').textContent = getCategoryName(post.category);
    document.getElementById('postDate').textContent = new Date(post.date).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('postBody').innerHTML = post.content.replace(/\n/g, '<br><br>');
    
    document.title = `${post.title} | Despacho Jurídico`;
    
    document.getElementById('postContent').style.display = 'block';
    document.getElementById('notFound').style.display = 'none';
}

function showNotFound() {
    document.getElementById('postContent').style.display = 'none';
    document.getElementById('notFound').style.display = 'block';
}

renderPost();
