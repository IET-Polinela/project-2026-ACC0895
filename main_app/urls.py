from django.urls import path
from . import views

urlpatterns = [
    path('',                   views.HomeView.as_view(),           name='home'),
    path('add/',               views.AddReportView.as_view(),      name='add_report'),
    path('edit/<int:pk>/',     views.EditReportView.as_view(),     name='edit_report'),
    path('delete/<int:pk>/',   views.DeleteReportView.as_view(),   name='delete_report'),
    path('verify/<int:pk>/',   views.VerifyReportView.as_view(),   name='verify_report'),
    path('progress/<int:pk>/', views.ProgressReportView.as_view(), name='progress_report'),
    path('resolve/<int:pk>/',  views.ResolveReportView.as_view(),  name='resolve_report'),
]