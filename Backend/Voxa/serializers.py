# chat/serializers.py
from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

# class MessageSerializer(serializers.ModelSerializer):
#     sender_id = serializers.IntegerField(source="sender.id", read_only=True)
#     sender_username = serializers.CharField(source="sender.username", read_only=True)
#     receiver_id = serializers.IntegerField(source="receiver.id", read_only=True)
#     receiver_username = serializers.CharField(source="receiver.username", read_only=True)

#     class Meta:
#         model = Message
#         fields = [
#             "id",
#             "sender_id",
#             "sender_username",
#             "receiver_id",
#             "receiver_username",
#             "text",
#             "timestamp",
#             "is_read",
#         ]

class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source="sender.id", read_only=True)
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    receiver_id = serializers.IntegerField(source="receiver.id", read_only=True)
    receiver_username = serializers.CharField(source="receiver.username", read_only=True)

    # Writable field for creating messages
    receiver = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )

    class Meta:
        model = Message
        fields = [
            "id",
            "sender_id",
            "sender_username",
            "receiver",          # used in POST requests
            "receiver_id",       # returned in response
            "receiver_username", # returned in response
            "text",
            "timestamp",
            "is_read",
        ]
