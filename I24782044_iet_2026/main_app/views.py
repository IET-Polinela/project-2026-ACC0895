from django.shortcuts import render, redirect
from .models import EmailLogin, Pesan

def home(request):
    # Handle form login email
    if request.method == 'POST' and 'email' in request.POST:
        email = request.POST.get('email')
        if email:
            EmailLogin.objects.create(email=email)
        return redirect('home')

    # Handle form saran/keluhan
    if request.method == 'POST' and 'isi' in request.POST:
        email = request.POST.get('email_pesan', '')
        kategori = request.POST.get('kategori')
        isi = request.POST.get('isi')
        if kategori and isi:
            Pesan.objects.create(email=email, kategori=kategori, isi=isi)
        return redirect('home')

    email_list = EmailLogin.objects.all().order_by('-waktu')
    pesan_list = Pesan.objects.all().order_by('-waktu')

    return render(request, 'main_app/home.html', {
        'email_list': email_list,
        'pesan_list': pesan_list,
    })