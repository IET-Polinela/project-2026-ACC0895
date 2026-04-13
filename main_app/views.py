from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Report

# Gunakan home.html untuk daftar laporan
class ReportListView(ListView):
    model = Report
    template_name = 'main_app/home.html'
    context_object_name = 'reports'

# Gunakan report_detail.html untuk detail laporan
class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'

# Gunakan add_report.html untuk tambah data
class ReportCreateView(CreateView):
    model = Report
    template_name = 'main_app/add_report.html'
    fields = ['title', 'category', 'description', 'location']
    success_url = reverse_lazy('report_list')

# Gunakan edit_report.html untuk edit data
class ReportUpdateView(UpdateView):
    model = Report
    template_name = 'main_app/edit_report.html'
    fields = ['title', 'category', 'description', 'location']
    success_url = reverse_lazy('report_list')

# Gunakan delete_report.html untuk konfirmasi hapus
class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html' # <-- UPDATE DI SINI
    success_url = reverse_lazy('report_list')

# View untuk Workflow (tetap sama)
class ReportUpdateStatusView(View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')
        report.status = new_status
        report.save()
        return redirect('report_list')