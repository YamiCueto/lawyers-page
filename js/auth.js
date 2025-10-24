if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'admin.html';
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');
    
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        window.location.href = 'admin.html';
    } else {
        errorMsg.textContent = 'Usuario o contraseña incorrectos';
        errorMsg.style.display = 'block';
    }
});
