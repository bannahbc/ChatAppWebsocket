from django.shortcuts import render

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


from rest_framework import generics,permissions
from .serializers import RegisterSerializer,UserSerializer
from .models import UserProfile
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

class RegisterView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

User = get_user_model()

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Exclude the current logged-in user
        return User.objects.exclude(id=self.request.user.id)



