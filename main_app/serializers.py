from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Report
        fields = [
            'id', 'title', 'category', 'description',
            'location', 'status', 'reporter',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reporter']