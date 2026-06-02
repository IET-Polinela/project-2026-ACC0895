// Update navbar berdasarkan status login
function updateNavbar() {
    const navMenus = document.getElementById('nav-menus');
    const token = localStorage.getItem('access_token');

    if (token) {
        navMenus.innerHTML = `
            <button class="btn btn-outline-light btn-sm" onclick="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
            </button>
        `;
    } else {
        navMenus.innerHTML = '';
    }
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.hash = '#login';
    updateNavbar();
}
