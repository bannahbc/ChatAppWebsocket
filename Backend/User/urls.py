from django.urls import path
from .views import EmailTokenObtainPairView,RegisterView,UserListView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', EmailTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('getusers/',UserListView.as_view(),name = "Get All users")
]
