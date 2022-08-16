from django.db.models import Q
from rest_framework import serializers
from .models import Profile, User, UserFollow, UserFriendRequest

class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollow
        fields = ("following_user_id", "created")

class FollowersSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollow
        fields = ("user_id", "created")

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFriendRequest
        fields = ("user_sender", "created", "accepted")

class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('profile_image',)

class UserPublicSerializer(serializers.ModelSerializer):
    profile = PublicProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ('id','email', 'first_name', 'last_name', 'profile')

class ProfileSerializer(serializers.ModelSerializer):
    gender = serializers.ChoiceField(Profile.GENDER_CHOICES, allow_null=True, required=False)
    user = UserPublicSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ('user','date_of_birth', 'gender', 
                'profile_image', 'cover_image', 'bio')

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        if request is None:
            return None

        profile = Profile.objects.create(user=user, **validated_data)
        return profile
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    friends = UserPublicSerializer(read_only=True, many=True)
    following = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    friend_requests = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id','email', 'first_name', 'last_name', 
                'is_verified', 'friends', 'following', 
                'followers', 'profile', 'friend_requests', 'username')

    def get_following(self, obj):
        return FollowingSerializer(obj.following.all(), many=True).data
    
    def get_followers(self, obj):
        return FollowersSerializer(obj.followers.all(), many=True).data

    def get_friend_requests(self, obj):
        return FriendRequestSerializer(obj.friend_requests.all(), many=True).data

    def get_username(self, obj):
        return obj.first_name + " " + obj.last_name