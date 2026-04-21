from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.views import View
from .models import Report
from .forms import ReportForm


class HomeView(ListView):
    model = Report
    template_name = 'main_app/home.html'
    context_object_name = 'reports'


class AddReportView(CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        messages.success(self.request, 'Laporan berhasil ditambahkan!')
        return super().form_valid(form)


class EditReportView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/edit_report.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        messages.success(self.request, 'Laporan berhasil diperbarui!')
        return super().form_valid(form)


class DeleteReportView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        messages.success(self.request, 'Laporan berhasil dihapus!')
        return super().form_valid(form)


class VerifyReportView(View):
    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        if report.status == 'REPORTED':
            report.status = 'VERIFIED'
            report.save()
            messages.success(request, f'Status laporan "{report.title}" diubah ke Diverifikasi.')
        return redirect('home')


class ProgressReportView(View):
    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        if report.status == 'VERIFIED':
            report.status = 'IN_PROGRESS'
            report.save()
            messages.success(request, f'Status laporan "{report.title}" diubah ke Diproses.')
        return redirect('home')


class ResolveReportView(View):
    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        if report.status == 'IN_PROGRESS':
            report.status = 'RESOLVED'
            report.save()
            messages.success(request, f'Status laporan "{report.title}" diubah ke Selesai.')
        return redirect('home')