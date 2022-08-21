from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync

from .serializers import MessageSerializer

from base.models import User
from .models import Conversation, Message
import json 
from uuid import UUID

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return obj.hex
        return json.JSONEncoder.default(self, obj)


class ChatConsumer(JsonWebsocketConsumer):
    """
    This consumer is used to show user's online status,
    and send notifications.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.conversation_name = None
        self.conversation = None
        self.user = None

    def connect(self):
        self.user = self.scope["user"]
        print(self.user, "IN CONNECT")
        if not self.user.is_authenticated:
            print("user is not authenticated")
            return

        self.accept()

        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.conversation, created = Conversation.objects.get_or_create(name=self.conversation_name)


        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )

        self.send_json({
            "type": "online_user_list",
            "users": [user.id for user in self.conversation.online.all()],
        })

        async_to_sync(self.channel_layer.group_send)(
            self.conversation_name,{
                "type": "user_join",
                "user": self.user.id,
            }
        )

        self.conversation.online.add(self.user)

        messages = self.conversation.messages.all().order_by("-timestamp")[:50]
        message_count = self.conversation.messages.all().count()
        self.send_json({
            "type": "last_50_messages",
            "messages": MessageSerializer(messages, many=True).data,
            "has_more": message_count > 50,
        })


    def disconnect(self, code):
        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "user_leave",
                    "user": self.user.id
                }
            )
            self.conversation.online.remove(self.user)
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "chat_message":
            message = Message.objects.create(
                from_user = self.user,
                to_user = self.get_receiver(),
                content=content["message"],
                conversation = self.conversation
            )
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "chat_message_echo",
                    "name" : str(self.user),
                    "message": MessageSerializer(message).data,
                }
            )
            notification_group_name = str(self.get_receiver().id) + "__notifications"
            async_to_sync(self.channel_layer.group_send)(
                notification_group_name,
                {
                    "type": "new_message_notification",
                    "name": self.user.id,
                    "message": MessageSerializer(message).data
                }
            )
        if message_type == "typing":
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "typing",
                    "user": self.user.id,
                    "typing": content["typing"],
                }
            )

        if message_type == "read_messages":
            messages_to_me = self.conversation.messages.filter(to_user=self.user)
            messages_to_me.update(read=True)

            unread_count = Message.objects.filter(to_user=self.user, read=False).count()
            async_to_sync(self.channel_layer.group_send)(
                str(self.user.id) + "__notifications",
                {
                    "type": "unread_count",
                    "unread_count": unread_count,
                }
            )
        return super().receive_json(content, **kwargs)

    def chat_message_echo(self, event):
        self.send_json(event)

    def get_receiver(self):
        ids = self.conversation_name.split("__")
        for id in ids:
            if int(id) != int(self.user.id):
                return User.objects.get(id=id)

    def user_join(self, event):
        self.send_json(event)

    def user_leave(self, event):
        self.send_json(event)

    def typing(self,event):
        self.send_json(event)

    def new_message_notification(self, event):
        self.send_json(event) 

    def unread_count(self, event):
        self.send_json(event)

    @classmethod
    def encode_json(cls, content):
        return json.dumps(content, cls=UUIDEncoder)


class NotificationConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.notification_group_name = None

    def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return
        self.accept()

        self.notification_group_name = str(self.user.id) + "__notifications"

        async_to_sync(self.channel_layer.group_add)(
            self.notification_group_name,
            self.channel_name,
        )
        unread_count = Message.objects.filter(to_user=self.user, read=False).count()
        unread_messages = Message.objects.filter(to_user=self.user, read=False).order_by("-timestamp")[:5]
        self.send_json(
            {
                "type": "unread_count",
                "unread_count": unread_count,
                "unread_messages": MessageSerializer(unread_messages, many=True).data,
            }
        )

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.notification_group_name,
            self.channel_name,
        )
        return super().disconnect(code)

    def new_message_notification(self, event):
        self.send_json(event)

    
    def unread_count(self, event):
        self.send_json(event)