// Redirigir si ya está autenticado
if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'admin.html';
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');
    const errorText = document.getElementById('errorText');
    const submitBtn = this.querySelector('.btn-login');
    
    // Ocultar error previo
    errorMsg.classList.remove('show');
    
    // Simular delay de autenticación
    setTimeout(() => {
        if (username === 'admin' && password === 'admin123') {
            // Login exitoso
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Actualizar botón a estado exitoso
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Acceso concedido!';
            submitBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #229954 100%)';
            
            // Redirigir después de un momento
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 800);
        } else {
            // Login fallido
            errorText.textContent = 'Usuario o contraseña incorrectos';
            errorMsg.classList.add('show');
            
            // Restaurar botón
            submitBtn.innerHTML = '<span>Iniciar Sesión</span><i class="fas fa-arrow-right"></i>';
            submitBtn.classList.remove('loading');
            
            // Shake animation en inputs
            const inputs = this.querySelectorAll('input');
            inputs.forEach(input => {
                input.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    input.style.animation = '';
                }, 500);
            });
        }
    }, 1200); // Simular latencia de red
});

// Animación de shake para inputs incorrectos
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

