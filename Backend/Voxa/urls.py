# chat/urls.py
from django.urls import path
from .views import MessageListView,MessageCreateView

urlpatterns = [
    path("createmessage/", MessageCreateView.as_view(), name="message-list-create"),
    path("getmessage/",MessageListView.as_view(),name="Get Messages")
]
