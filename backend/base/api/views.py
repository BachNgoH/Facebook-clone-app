
from django.dispatch import receiver
from base.models import User, Profile, UserFollow, UserFriendRequest
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from base.serializers import FollowingSerializer, FollowersSerializer, FriendRequestSerializer, ProfileSerializer, UserPublicSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

class UserRetriveView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

class CurrentUserRetrieveView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )

    def get_object(self):
        current_user = self.request.user
        obj = current_user
        return obj


class ProfileCreateView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)


class ProfileUpdateView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        current_user = self.request.user
        obj = current_user.profile
        return obj

    def perform_update(self, serializer):
        return super().perform_update(serializer)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request, id):
    current_user = request.user
    if id == current_user.id:
        return Response("Cannot follow yourself", status=status.HTTP_400_BAD_REQUEST)
    
    if not User.objects.filter(id=id).exists():
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)
    
    target_user = User.objects.get(id=id)

    UserFollow.objects.create(
        user_id=current_user,
        following_user_id=target_user)

    return Response("follow successfully", status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unfollow(request, id):
    current_user = request.user
    target_user = User.objects.get(id=id)

    if not User.objects.filter(id=id).exists():
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)
    
    relationship = current_user.following.all().get(following_user_id=target_user)

    if not current_user.following.all().filter(following_user_id=target_user).exits():
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)

    relationship.delete()
    return Response("Unfollow successfully", status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_following(request):
    user = request.user
    data = FollowingSerializer(user.following.all(), many=True).data
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followers(request):
    user = request.user
    data = FollowersSerializer(user.followers.all(), many=True).data
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request, id):
    sender = request.user
    if id == sender.id:
        return Response("Cannot add yourself", status=status.HTTP_400_BAD_REQUEST)

    if not User.objects.filter(id=id).exists():
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)
    
    receiver = User.objects.get(id=id)

    
    friend_request = UserFriendRequest(user_sender = sender, user_receiver = receiver)
    friend_request.save()

    return Response("Request sent successfully", status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, id):
    receiver = request.user

    if not User.objects.filter(id=id).exists():
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)

    sender = User.objects.get(id=id)
    
    if not UserFriendRequest.objects.filter(user_sender = sender, user_receiver = receiver).exists():
        return Response("Relationship not found", status=status.HTTP_400_BAD_REQUEST)

    friend_request = UserFriendRequest.objects.get(user_sender = sender, user_receiver = receiver)

    friend_request.delete()

    receiver.friends.add(sender)
    return Response("Friend request accepted successfully", status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_friend_requests(request):
    user = request.user
    data = FriendRequestSerializer(user.friend_requests.all(), many=True).data
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_friends(request):
    user = request.user
    data = UserPublicSerializer(user.friends.all(), many=True).data
    return Response(data, status=status.HTTP_200_OK)
