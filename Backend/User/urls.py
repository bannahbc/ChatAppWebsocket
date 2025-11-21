from django.urls import path
from .views import EmailTokenObtainPairView,RegisterView,UserListView,update_profile_pic
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', EmailTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('getusers/',UserListView.as_view(),name = "Get All users"),
    path('update-profile-pic/', update_profile_pic, name='update_profile_pic'),
]

# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
