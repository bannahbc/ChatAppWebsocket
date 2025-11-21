# utils.py
from django.db.models import Count
from Voxa.models import Message

def get_unread_count(sender, receiver):
    return Message.objects.filter(sender=sender, receiver=receiver, is_read=False).count()
