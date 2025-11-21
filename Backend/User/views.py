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
    
    
# profilepic update view

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfilePicSerializer

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_pic(request):
    user =request.user
    serializer = ProfilePicSerializer(user,data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Profile picture updated successfully", "data":serializer.data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



