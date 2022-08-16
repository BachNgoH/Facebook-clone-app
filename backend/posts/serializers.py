from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from .models import Comment, Group, Image, Post, React
from base.serializers import UserPublicSerializer, UserSerializer



class PostSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    is_nested = serializers.SerializerMethodField()
    react_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    shared_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'author', 'created', 'content',
                  'shared_post', 'group', 'scope', 'is_nested', 'react_count', 'comment_count', 'shared_count')

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

    def get_react_count(self, obj):
        return len(obj.reacts.all())

    def get_comment_count(self, obj):
        return len(obj.comments.all())

    def get_shared_count(self, obj):
        return len(obj.posts.all())


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

class CommentHelperSerialer(serializers.Serializer):
    id = serializers.IntegerField()

class CommentSerializer(serializers.ModelSerializer):
    is_nested = serializers.SerializerMethodField()
    post = PostSerializer(read_only=True)
    author = UserPublicSerializer(read_only=True)
    num_replies = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'author', 'post', 'reply_of_comment', 'content', 'is_nested', 'num_replies', 'created', 'replies')

    def get_is_nested(self, obj):
        reply_comment = obj.reply_of_comment
        if reply_comment is not None:
            return True
        return False

    def get_num_replies(self, obj):
        return len(obj.replies.all())

    def get_replies(self, obj):
        return  CommentHelperSerialer( obj.replies.all() , many=True ).data

    def create(self, validated_data):
        request = self.context.get('request')
        if request is None:
            raise ValidationError
        user = request.user

        is_nested = validated_data.get('reply_of_comment') is not None
        reply_of_comment = None
        if is_nested:
            reply_of_comment = validated_data.pop('reply_of_comment')
            print(reply_of_comment)
            if reply_of_comment.reply_of_comment is not None:
                reply_of_comment = reply_of_comment.reply_of_comment

        comment = Comment.objects.create(
            author=user, reply_of_comment=reply_of_comment, **validated_data)
        
        return comment

class ReactSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    class Meta:
        model=React
        fields=('id','post', 'author', 'react_type')

    def create(self, validated_data):
        request = self.context.get('request')
        post = validated_data['post']
        if request is None:
            raise ValidationError
        user = request.user
        if (post.reacts.filter(author = user).exists()):
            react = post.reacts.get(author = user)
            react.react_type = validated_data.get('react_type')
            react.save()
        else:
            react = React.objects.create(author=user, **validated_data)
        
        return react
    