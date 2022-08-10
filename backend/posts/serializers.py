from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from .models import Group, Image, Post
from base.serializers import UserPublicSerializer, UserSerializer



class PostSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    is_nested = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'created', 'content',
                  'shared_post', 'group', 'scope', 'is_nested')

    def create(self, validated_data):
        request = self.context.get('request')
        if request is None:
            raise ValidationError
        user = request.user

        is_nested = validated_data.get('shared_post') is not None
        shared_post = None
        if is_nested:
            shared_post = validated_data.pop('shared_post')
            print(shared_post)
            if shared_post.shared_post is not None:
                shared_post = shared_post.shared_post

        post = Post.objects.create(
            author=user, shared_post=shared_post, **validated_data)
        return post

    def get_is_nested(self, obj):
        shared_post = obj.shared_post
        if shared_post is not None:
            return True
        return False

    def update(self, instance, validated_data):
        content = validated_data.get('content')
        scope = validated_data.get('scope')

        if content is not None:
            instance.content = content

        if scope is not None:
            instance.scope = scope
        
        instance.save()
        return instance


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('image','post')

    def create(self, validated_data):
        request = self.context.get('request')
        if request is None:
            return None

        user = request.user
        post = validated_data.get('post')
        if post not in user.posts.all():
            raise ValidationError

        image = Image.objects.create(image=validated_data.get('image'), post=post)
        return image

class GroupSerializer(serializers.ModelSerializer):
    admin = UserPublicSerializer(read_only=True)
    members = UserPublicSerializer(many=True)
    class Meta:
        model = Group
        fields = ('id','admin','group_name', 'about', 'members', 'cover_image', 'scope')

    def create(self, validated_data):
        request = self.context.get('request')
        if request is None:
            return None
        user = request.user

        return Group.objects.create(admin=user, **validated_data)


