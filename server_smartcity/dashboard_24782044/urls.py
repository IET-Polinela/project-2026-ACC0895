from django.urls import path
from .views import *

app_name = 'dashboard'   # ← TAMBAHKAN BARIS INI

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('api/stats/', StatsAPIView.as_view(), name='stats'),
    path('api/reports/', ReportListAPIView.as_view(), name='report_list'),
    path('api/reports/<int:pk>/', ReportDetailAPIView.as_view(), name='report_detail'),
]