from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from django.views import View
from .models import Report
from .forms import ReportForm


# ─── Mixin: cek apakah user adalah admin ───────────────────────────────────
class AdminRequiredMixin:
    """Mixin ini memblokir akses jika user bukan admin."""

    def dispatch(self, request, *args, **kwargs):
        # Cek 1: user harus login dulu
        if not request.user.is_authenticated:
            messages.error(request, "⚠️ Silakan login terlebih dahulu.")
            return redirect('login')
        # Cek 2: user harus punya is_admin = True
        if not request.user.is_admin:
            messages.error(request, "🚫 Akses Ditolak. Fitur ini hanya untuk Admin.")
            return redirect('home')
        return super().dispatch(request, *args, **kwargs)


# ─── Home: semua user bisa lihat ──────────────────────────────────────────
class HomeView(ListView):
    model = Report
    template_name = 'main_app/home.html'
    context_object_name = 'reports'


class ReportListView(AdminRequiredMixin, ListView):
    """Separate report listing page using `report_list.html`.

    This ensures `/reports/` shows the dedicated list template instead of
    the homepage hero and stats.
    """
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'


# ─── CRUD: hanya Admin ────────────────────────────────────────────────────
class AddReportView(AdminRequiredMixin, CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, '✅ Laporan berhasil ditambahkan!')
        return super().form_valid(form)


class EditReportView(AdminRequiredMixin, UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/edit_report.html'
    # Setelah edit, kembali ke daftar laporan, bukan beranda
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, '✅ Laporan berhasil diperbarui!')
        return super().form_valid(form)


class DeleteReportView(AdminRequiredMixin, DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, '✅ Laporan berhasil dihapus!')
        return super().form_valid(form)


class VerifyReportView(AdminRequiredMixin, View):
    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        if report.status == 'REPORTED':
            report.status = 'VERIFIED'
            report.save()
            messages.success(request, f'✅ Laporan "{report.title}" diverifikasi.')
        return redirect('home')


class ProgressReportView(AdminRequiredMixin, View):
    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        if report.status == 'VERIFIED':
            report.status = 'IN_PROGRESS'
            report.save()
            messages.success(request, f'✅ Status "{report.title}" diproses.')
        return redirect('home')


class ResolveReportView(AdminRequiredMixin, View):
    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        if report.status == 'IN_PROGRESS':
            report.status = 'RESOLVED'
            report.save()
            messages.success(request, f'✅ Laporan "{report.title}" selesai.')
        return redirect('home')