# chat/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Message(models.Model):
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_messages",
        null=True, blank=True
    )
    # If you want group chats, you can replace receiver with a ChatRoom model

    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        sender_name = self.sender.username if self.sender else "Unknown"
        receiver_name = self.receiver.username if self.receiver else "None"
        return f"{sender_name} → {receiver_name}: {self.text[:30]}"

