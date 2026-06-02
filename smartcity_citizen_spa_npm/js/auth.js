function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return; // Jaga-jaga kalau form belum ada di DOM

    form.addEventListener('submit', async function(event) {
        // WAJIB! Cegah halaman reload (yang akan bocorkan password ke URL)
        event.preventDefault();

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Kirim ke endpoint JWT Django
            const response = await requestAPI('/api/token/', 'POST', {
                username: username,
                password: password
            });

            if (response.status === 200) {
                const data = await response.json();

                // Simpan kedua token ke localStorage
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);

                alert('Login berhasil! Selamat datang.');

                // Pindah ke halaman dashboard
                window.location.hash = '#dashboard';

            } else {
                const errorData = await response.json();
                alert('Login gagal! Periksa username dan password. Error: ' + JSON.stringify(errorData));
            }

        } catch (error) {
            alert('Terjadi kesalahan koneksi: ' + error.message);
        }
    });
}
