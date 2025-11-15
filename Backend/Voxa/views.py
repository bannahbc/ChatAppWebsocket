# chat/views.py
from rest_framework import generics, permissions
from .models import Message
from .serializers import MessageSerializer
from django.db.models import Q


class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

# class MessageListCreateView(generics.ListCreateAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         # Get all messages where user is sender or receiver
#         return Message.objects.filter(models.Q(sender=user) | models.Q(receiver=user))

#     def perform_create(self, serializer):
#         serializer.save(sender=self.request.user)

# class MessageListView(generics.ListAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         # Return all messages where user is sender or receiver
#         return Message.objects.filter(Q(sender=user) | Q(receiver=user))
# class MessageListView(generics.ListAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         queryset = Message.objects.filter(Q(sender=user) | Q(receiver=user))

#         # Optional filter: ?receiver=<id>
#         receiver_id = self.request.query_params.get("receiver")
#         if receiver_id:
#             queryset = queryset.filter(
#                 Q(sender=user, receiver_id=receiver_id) |
#                 Q(receiver=user, sender_id=receiver_id)
#             )

#         return queryset

class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.request.query_params.get("receiver")

        if other_user_id:
            # Only messages between current user and the specified other user
            return Message.objects.filter(
                Q(sender=user, receiver_id=other_user_id) |
                Q(receiver=user, sender_id=other_user_id)
            ).order_by("timestamp")

        # If no receiver param, return empty or all user messages
        return Message.objects.none()