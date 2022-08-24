from base64 import decode
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async 
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token 
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from base.models import User
from jwt import decode as jwt_decode
from django.conf import settings
from .consumers import UUIDEncoder
import json 


class TokenAuthMiddleware:
    """
    Custom middleware that takes a token from the query string and authenticates via Django Rest Framework authtoken.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    @classmethod
    def encode_json(cls, content):
        return json.dumps(content, cls=UUIDEncoder)
    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params["token"][0]
        # scope["token"] = token
        # scope["user"] = await get_user(scope)
        # print(scope["user"])
        # return await self.app(scope, receive, send)
    
        try:
            # this will automatically validate the token and raise an error if token is invalid
            UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            # Token is invalid
            print(e)
            return None
        else:
            decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            print(decoded_data)
            # user = await sync_to_async(User.objects.get)(id=decoded_data["user_id"])
            scope["user_id"] = decoded_data["user_id"]
        return await self.app(scope, receive, send)

