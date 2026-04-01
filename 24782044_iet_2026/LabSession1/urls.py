from django.contrib import admin
from django.urls import path
from django.http import HttpResponse

# Fungsi untuk menampilkan pesan sambutan
def welcome_view(request):
    return HttpResponse("Halo, Selamat Datang di Aplikasi Web 24782044!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('welcome/', welcome_view),
]
