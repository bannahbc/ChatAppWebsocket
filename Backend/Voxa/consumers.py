from channels.generic.websocket import AsyncWebsocketConsumer


# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         sender_id = self.scope["user"].id
#         receiver_id = self.scope['url_route']['kwargs']['receiver_id']

#         # Shared room name for both users
#         ids = sorted([sender_id, int(receiver_id)])
#         self.room_group_name = f"chat_{ids[0]}_{ids[1]}"

#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )
#         await self.accept()
#         print(f"✅ Connected to chat room {self.room_group_name}")

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {"type": "chat_message", "message": data}
#         )

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps(event["message"]))
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer
from channels.db import database_sync_to_async

#                         working fine                  
# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         sender_id = self.scope["user"].id
#         receiver_id = self.scope["url_route"]["kwargs"]["receiver_id"]

#         # Shared room name for both users
#         ids = sorted([sender_id, int(receiver_id)])
#         self.room_group_name = f"chat_{ids[0]}_{ids[1]}"

#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         sender = self.scope["user"]
#         receiver_id = data["receiver"]
#         text = data["text"]

#         # Save message to DB
#         message = await self.save_message(sender.id, receiver_id, text)

#         # Serialize and broadcast
#         serializer = MessageSerializer(message)
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 "type": "chat_message",
#                 "message": serializer.data
#             }
#         )

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps(event["message"]))

#     @database_sync_to_async
#     def save_message(self, sender_id, receiver_id, text):
#         User = get_user_model()
#         sender = User.objects.get(id=sender_id)
#         receiver = User.objects.get(id=receiver_id)
#         return Message.objects.create(sender=sender, receiver=receiver, text=text)
from django.contrib.auth.models import AnonymousUser
from django.utils import timezone
User = get_user_model()

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer  # adjust if you keep serializers elsewhere

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if not user or not user.is_authenticated:
            await self.close(code=4001)
            return

        self.user = user
        self.receiver_id = int(self.scope["url_route"]["kwargs"]["receiver_id"])
        ids = sorted([self.user.id, self.receiver_id])
        self.room_group_name = f"chat_{ids[0]}_{ids[1]}"

        # Join shared room + personal group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.channel_layer.group_add(f"user_{self.user.id}", self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.channel_layer.group_discard(f"user_{self.user.id}", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        # Handle mark-as-read
        if data.get("type") == "mark_read":
            await self.mark_chat_as_read(data["sender"], self.user.id)
            return

        # Handle new message
        sender = self.scope["user"]
        receiver_id = int(data["receiver"])
        text = data["text"]

        message = await self.save_message(sender.id, receiver_id, text)

        serializer = MessageSerializer(message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "chat_message", "message": serializer.data}
        )

        unread_count = await self.get_unread_count(sender.id, receiver_id)
        await self.channel_layer.group_send(
            f"user_{receiver_id}",
            {"type": "unread_update", "sender": sender.id, "unread_count": unread_count}
        )

    # Event handlers
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "chat_message",
            "message": event["message"]
        }))

    async def unread_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "unread_update",
            "sender": event["sender"],
            "unread_count": event["unread_count"],
        }))

    # DB helpers
    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, text):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        return Message.objects.create(sender=sender, receiver=receiver, text=text)

    @database_sync_to_async
    def get_unread_count(self, sender_id, receiver_id):
        return Message.objects.filter(sender_id=sender_id, receiver_id=receiver_id, is_read=False).count()

    @database_sync_to_async
    def mark_as_read(self, sender_id, receiver_id):
        Message.objects.filter(sender_id=sender_id, receiver_id=receiver_id, is_read=False).update(is_read=True)

    async def mark_chat_as_read(self, sender_id, receiver_id):
        await self.mark_as_read(sender_id, receiver_id)
        await self.channel_layer.group_send(
            f"user_{receiver_id}",
            {"type": "unread_update", "sender": sender_id, "unread_count": 0}
        )

# consumers.py

import json
from datetime import datetime

class PresenceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        await self.channel_layer.group_add("presence", self.channel_name)
        await self.accept()

        # Broadcast that this user is online
        await self.channel_layer.group_send(
            "presence",
            {
                "type": "presence_update",
                "user_id": self.user.id,
                "online": True,
                "lastSeen": None,
            },
        )

    async def disconnect(self, close_code):
        # Broadcast that this user went offline
        await self.channel_layer.group_send(
            "presence",
            {
                "type": "presence_update",
                "user_id": self.user.id,
                "online": False,
                "lastSeen": datetime.utcnow().isoformat(),
            },
        )

    async def presence_update(self, event):
        await self.send(text_data=json.dumps(event))

# class ChatConsumer(AsyncWebsocketConsumer):
#     print("im attttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt")
#     async def connect(self):
#         self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
#         self.room_group_name = f"chat_{self.receiver_id}"

#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )
#         await self.accept()
#         print(f"✅ Connected to chat room {self.room_group_name}")

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )
#         print(f"⚠️ Disconnected from chat room {self.room_group_name}")

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {"type": "chat_message", "message": data}
#         )

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps(event["message"]))
