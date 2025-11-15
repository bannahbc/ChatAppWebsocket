import json
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


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        sender_id = self.scope["user"].id
        receiver_id = self.scope["url_route"]["kwargs"]["receiver_id"]

        # Shared room name for both users
        ids = sorted([sender_id, int(receiver_id)])
        self.room_group_name = f"chat_{ids[0]}_{ids[1]}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender = self.scope["user"]
        receiver_id = data["receiver"]
        text = data["text"]

        # Save message to DB
        message = await self.save_message(sender.id, receiver_id, text)

        # Serialize and broadcast
        serializer = MessageSerializer(message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": serializer.data
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, text):
        User = get_user_model()
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        return Message.objects.create(sender=sender, receiver=receiver, text=text)





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
