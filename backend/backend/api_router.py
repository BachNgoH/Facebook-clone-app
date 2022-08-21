from chats.views import ConversationViewSet, MessageViewSet
from django.conf import settings
from chats.views import ConversationViewSet
from rest_framework.routers import DefaultRouter, SimpleRouter

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("conversations", ConversationViewSet)
router.register("messages", MessageViewSet)

api_name = "api"
urlpatterns = router.urls