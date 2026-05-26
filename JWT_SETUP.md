# JWT Authentication Setup - Dokumentasi

## ✅ Konfigurasi yang Sudah Ditambahkan

### 1. **settings.py**
Konfigurasi JWT telah ditambahkan dengan pengaturan:
- Access token lifetime: 60 menit
- Refresh token lifetime: 1 hari
- Algorithm: HS256
- Auth header type: Bearer

### 2. **urls.py**
Endpoint JWT telah ditambahkan:
- `/api/token/` - Untuk mendapatkan access & refresh token
- `/api/token/refresh/` - Untuk refresh access token

### 3. **INSTALLED_APPS**
- `rest_framework` ✓
- `rest_framework_simplejwt` ✓

---

## 🧪 Cara Menguji JWT

### Langkah 1: Jalankan Server
```bash
python manage.py runserver
```

### Langkah 2: Buat User (jika belum ada)
```bash
python manage.py createsuperuser
```

### Langkah 3: Test dengan Script
```bash
python test_jwt.py
```

### Langkah 4: Test Manual dengan cURL atau Postman

#### A. Dapatkan Token (Login)
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"your_username\",\"password\":\"your_password\"}"
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### B. Gunakan Access Token
```bash
curl -X GET http://127.0.0.1:8000/api/protected-endpoint/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

#### C. Refresh Token
```bash
curl -X POST http://127.0.0.1:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d "{\"refresh\":\"eyJ0eXAiOiJKV1QiLCJhbGc...\"}"
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 📝 Contoh Penggunaan di Views

### Protect API View dengan JWT
```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        'message': 'Ini adalah protected endpoint',
        'user': request.user.username
    })
```

### Atau dengan Class-Based View
```python
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'message': 'Ini adalah protected endpoint',
            'user': request.user.username
        })
```

---

## 🔧 Konfigurasi JWT yang Dapat Disesuaikan

Edit di `settings.py` bagian `SIMPLE_JWT`:

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # Ubah durasi access token
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),     # Ubah durasi refresh token
    'ROTATE_REFRESH_TOKENS': False,                  # Set True untuk rotate refresh token
    'BLACKLIST_AFTER_ROTATION': False,               # Set True untuk blacklist old token
    # ... konfigurasi lainnya
}
```

---

## ⚠️ Troubleshooting

### Error: "Authentication credentials were not provided"
- Pastikan header `Authorization: Bearer <token>` sudah benar
- Cek apakah token masih valid (belum expired)

### Error: "Token is invalid or expired"
- Gunakan refresh token untuk mendapatkan access token baru
- Atau login ulang untuk mendapatkan token baru

### Error: "No such table: auth_user"
- Jalankan: `python manage.py migrate`

---

## 📚 Referensi
- [Django REST Framework Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [JWT.io](https://jwt.io/) - Untuk decode dan debug JWT token
