const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'root' && password === 'dani2003') {
        // Autenticación correcta, redirigir a la página de inicio
        window.location.href = '/inicio/inicio.html';
    } else {
        errorMessage.textContent = 'Usuario o contraseña incorrectos';
    }
});