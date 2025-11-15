# chat/urls.py
from django.urls import path
from .views import MessageListView,MessageCreateView

urlpatterns = [
    path("createmessage/", MessageCreateView.as_view(), name="message-list-create"),
    path("getmessage/",MessageListView.as_view(),name="Get Messages")
]

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<receiver_id>\d+)/$", consumers.ChatConsumer.as_asgi()),
]
