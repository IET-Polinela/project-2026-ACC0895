from django.views.generic import TemplateView
from django.views import View
from django.http import JsonResponse
from django.db.models import Count
from django.shortcuts import get_object_or_404   # PERBAIKAN: import yang hilang
from main_app.models import Report
from main_app.views import AdminRequiredMixin
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class DashboardView(AdminRequiredMixin, TemplateView):
    template_name = 'dashboard/index.html'


class StatsAPIView(View):
    def get(self, request):
        status_data = (
            Report.objects
            .values('status')
            .annotate(count=Count('id'))
        )
        category_data = (
            Report.objects
            .values('category')
            .annotate(count=Count('id'))
        )
        recent_reported = list(
            Report.objects
            .filter(status='REPORTED')
            .order_by('-created_at')[:5]
            .values('id', 'title', 'category', 'location', 'created_at')
        )
        recent_resolved = list(
            Report.objects
            .filter(status='RESOLVED')
            .order_by('-updated_at')[:5]
            .values('id', 'title', 'category', 'location', 'updated_at')
        )
        return JsonResponse({
            'status_distribution':  list(status_data),
            'category_distribution': list(category_data),
            'recent_reported': recent_reported,
            'recent_resolved': recent_resolved,
        })


@method_decorator(csrf_exempt, name='dispatch')
class ReportListAPIView(View):
    def get(self, request):
        q     = request.GET.get('q', '')
        page  = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))

        reports = Report.objects.all().order_by('-created_at')
        if q:
            reports = reports.filter(title__icontains=q)

        total = reports.count()
        start = (page - 1) * limit
        data  = list(reports[start:start + limit].values(
            'id', 'title', 'category', 'status', 'location', 'created_at'
        ))
        return JsonResponse({'data': data, 'total': total})

    def post(self, request):
        body   = json.loads(request.body)
        report = Report.objects.create(
            title=body['title'],
            category=body['category'],
            description=body['description'],
            location=body['location'],
        )
        return JsonResponse({'id': report.id}, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class ReportDetailAPIView(View):
    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        data = {
            'id':          report.id,
            'title':       report.title,
            'category':    report.category,
            'status':      report.status,
            'location':    report.location,
            'description': report.description,
            'created_at':  report.created_at.strftime('%d %B %Y, %H:%M'),
        }
        return JsonResponse(data)

    def patch(self, request, pk):
        body   = json.loads(request.body)
        report = get_object_or_404(Report, pk=pk)
        report.status = body.get('status', report.status)
        report.save()
        return JsonResponse({'status': report.status})

    def delete(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        report.delete()
        return JsonResponse({'deleted': True})