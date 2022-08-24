from dataclasses import fields
from rest_framework import serializers
from chats.models import Conversation, Message
from base.models import User
from base.serializers import UserPublicSerializer, UserSerializer

class MessageSerializer(serializers.ModelSerializer):

    from_user = serializers.SerializerMethodField()
    to_user = serializers.SerializerMethodField()
    conversation = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = (
            "id",
            "conversation",
            "from_user",
            "to_user",
            "content",
            "timestamp",
            "read"
        )

    def get_conversation(self, obj):
        return str(obj.conversation.id)

    def get_from_user(self, obj):
        return UserPublicSerializer(obj.from_user).data

    def get_to_user(self, obj):
        return UserPublicSerializer(obj.to_user).data


class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ("id", "name", "other_user", "last_message")

    def get_last_message(self, obj):
        messages = obj.messages.all().order_by("-timestamp")
        if not messages.exists():
            return None
        message = messages[0]
        return MessageSerializer(message).data

    def get_other_user(self, obj):
        ids = obj.name.split("__")
        context = {}

        for id in ids:
            if id !=  str(self.context["user"].id):
                other_user = User.objects.get(id=id)
                return UserSerializer(other_user, context=context).data