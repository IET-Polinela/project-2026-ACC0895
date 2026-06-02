const API_BASE_URL = 'http://127.0.0.1:8000';

async function requestAPI(endpoint, method = 'GET', bodyData = null) {
    // Ambil token dari localStorage (kalau sudah login)
    const token = localStorage.getItem('access_token');

    // Siapkan headers
    const headers = {
        'Content-Type': 'application/json',
    };

    // Jika token ada, sisipkan ke header Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Siapkan opsi request
    const options = {
        method: method,
        headers: headers,
    };

    // Jika ada data yang dikirim (POST/PUT), masukkan ke body
    if (bodyData) {
        options.body = JSON.stringify(bodyData);
    }

    // Kirim request ke Django
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return response;
}
