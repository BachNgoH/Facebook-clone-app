from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import UserIsVerifiedPermission
from base.models import Profile, User
from rest_framework import status, exceptions

from .serializers import RegisterSerializer
from rest_framework import generics
from django.contrib.auth.tokens import default_token_generator

# Create your views here.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
            
        if not user.is_verified:
            raise exceptions.AuthenticationFailed(
                "Account is not verified",
                "not_activated_account",
            )
        token = super().get_token(user)


        token['email'] = user.email
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = (UserIsVerifiedPermission,)



class MyTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer
    permission_classes = (UserIsVerifiedPermission,)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        
        return super().perform_create(serializer)

@api_view(['GET'])
@permission_classes([AllowAny])
def activate(request, pk=None):
    user_id = request.query_params.get('user_id', '')
    confirmation_token = request.query_params.get('confirmation_token', '')
    try:
        user = User.objects.all().get(pk=user_id)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is None:
        return Response('User not found', status=status.HTTP_400_BAD_REQUEST)
    if not default_token_generator.check_token(user, confirmation_token):
        profile = Profile.objects.get(user=user)
        user.delete()
        profile.delete()
        return Response('Token is invalid or expired. Please request another confirmation token')
    
    user.is_verified = True
    user.save()
    return Response('Email successfully confirmed')

