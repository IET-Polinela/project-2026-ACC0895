from rest_framework import generics, permissions
from drf_spectacular.utils import extend_schema
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

User = get_user_model()


@extend_schema(exclude=True)
class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]