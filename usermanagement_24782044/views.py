from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib import messages
from django.views import View
from .forms import RegisterForm

class CustomLoginView(LoginView):
    template_name = 'login.html'

    def form_valid(self, form):
        messages.success(self.request, "✅ Berhasil login!")
        return super().form_valid(form)


class CustomLogoutView(LogoutView):
    next_page = 'login'  # redirect ke login setelah logout

    def dispatch(self, request, *args, **kwargs):
        messages.success(request, "👋 Berhasil logout!")
        return super().dispatch(request, *args, **kwargs)


class RegisterView(View):
    def get(self, request):
        form = RegisterForm()
        return render(request, 'register.html', {'form': form})

    def post(self, request):
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "✅ Registrasi berhasil, silakan login.")
            return redirect('login')
        return render(request, 'register.html', {'form': form})