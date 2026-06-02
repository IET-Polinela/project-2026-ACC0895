# 🌐 Smart City Portal - Frontend SPA

Single Page Application (SPA) untuk Portal Warga Smart City Tracker menggunakan Vanilla JavaScript dan Bootstrap 5.

## 🚀 Cara Menjalankan

```bash
# Dari folder ini
python -m http.server 5500
```

Lalu buka browser: **http://127.0.0.1:5500**

⚠️ **PENTING:** Backend Django harus berjalan di port 8000!

## 📁 Struktur File

```
smartcity_citizen_spa_npm/
├── index.html          # Halaman utama (kerangka SPA)
└── js/
    ├── api.js          # Fungsi untuk request ke API Django
    ├── auth.js         # Handler login & JWT
    ├── app.js          # Navbar & logout
    └── router.js       # Hash-based routing
```

## 🔑 Fitur

- ✅ **Hash-based Routing** - Navigasi tanpa reload halaman
- ✅ **JWT Authentication** - Login dengan token
- ✅ **Responsive Layout** - Desktop (3 kolom) & Mobile (1 kolom)
- ✅ **localStorage** - Simpan token di browser
- ✅ **Bootstrap 5** - UI modern & responsive
- ✅ **Bootstrap Icons** - Icon library

## 📄 Halaman

### #login
- Form login dengan username & password
- Kirim POST ke `/api/token/`
- Simpan access_token & refresh_token ke localStorage

### #dashboard
- Layout 3 kolom (desktop) / 1 kolom (mobile)
- Kolom kiri: Tombol "Laporan Baru"
- Kolom tengah: Konten utama
- Kolom kanan: Pengumuman (hidden di mobile)

## 🔧 Konfigurasi

### API Base URL
Edit di `js/api.js`:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

### JWT Token Storage
Token disimpan di localStorage:
- `access_token` - Untuk akses API (60 menit)
- `refresh_token` - Untuk refresh token (1 hari)

## 🧪 Testing

### Login
1. Buka http://127.0.0.1:5500
2. Masukkan username & password
3. Klik "Masuk"
4. Jika berhasil → redirect ke #dashboard

### Cek Token di localStorage
1. Buka DevTools (F12)
2. Tab Application → Local Storage → http://127.0.0.1:5500
3. Lihat `access_token` dan `refresh_token`

### Cek Network Request
1. Buka DevTools (F12)
2. Tab Network
3. Login
4. Lihat request POST ke `/api/token/` → Status 200

## 📱 Responsive Design

### Desktop (≥992px)
```
┌─────────────────────────────────────┐
│         Navbar (100%)               │
├─────────┬───────────┬───────────────┤
│  Sidebar│  Content  │   Sidebar     │
│  (25%)  │   (50%)   │    (25%)      │
└─────────┴───────────┴───────────────┘
```

### Mobile (<992px)
```
┌─────────────────┐
│  Navbar (100%)  │
├─────────────────┤
│  Sidebar (100%) │
├─────────────────┤
│  Content (100%) │
└─────────────────┘
```

## 🔍 Troubleshooting

### CORS Error
**Error:** `Access to fetch ... has been blocked by CORS policy`

**Solusi:** Pastikan Django settings.py sudah dikonfigurasi:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Paling atas!
    # ...
]

CORS_ALLOW_ALL_ORIGINS = True
```

### Login Gagal
**Error:** `Login gagal! Periksa username dan password`

**Solusi:** 
1. Pastikan user sudah dibuat: `python manage.py createsuperuser`
2. Cek username & password yang dimasukkan
3. Cek DevTools Console untuk error detail

### Halaman Tidak Berganti
**Solusi:**
1. Cek Console untuk JavaScript error
2. Pastikan urutan script di index.html benar
3. Clear cache browser (Ctrl+Shift+R)

## 📚 Dependencies

### CDN yang Digunakan:
- **Bootstrap 5.3.0** - CSS Framework
- **Bootstrap Icons 1.11.1** - Icon Library

### Browser Support:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 tidak didukung (butuh polyfill untuk fetch & arrow function)

## 🎓 Lab Session 11

File ini adalah bagian dari Lab Session 11 - Single Page Application dengan JWT Authentication.

Untuk panduan lengkap, lihat: `../LAB_11_PANDUAN_LENGKAP.md`
