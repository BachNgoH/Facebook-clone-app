from turtle import pos
from rest_framework import generics, exceptions
from rest_framework.permissions import IsAuthenticated
from posts.api.paginaters import PostPagination
from posts.models import Comment, Group, Image, Post, React
from base.models import User
from posts.serializers import CommentSerializer, GroupSerializer, ImageSerializer, PostSerializer, ReactSerializer
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status


class PostCreateListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticated, )
    pagination_class = PostPagination

    def get_queryset(self):
        user = self.request.user
        user_following = [query.following_user_id for query in  user.following.all()]
        queryset = self.queryset.filter(Q(scope='PU', author__in=user.friends.all()) |
                                        Q(scope='PU', author__in=user_following) |
                                        Q(scope='PR', author__in=user.friends.all())).order_by("-created")
        return queryset

class PostByUserListView(generics.ListAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticated,)
    lookup_field = 'id'
    pagination_class = PostPagination

    def get_queryset(self):
        if User.objects.filter(id= self.kwargs[self.lookup_field]).exists():
            user = User.objects.get(id= self.kwargs[self.lookup_field])
        else:
            raise exceptions.NotAcceptable(
                "No User Found",
                "no_user_found",
            )
        current_user = self.request.user
        if (user.id == current_user.id):
            queryset = self.queryset.filter(author=user).order_by("-created")
        elif (user in current_user.friends.all()):
            queryset = self.queryset.filter(Q(scope='PU', author=user) | Q(
                scope='PR', author=user)).order_by("-created")
        else:
            queryset = self.queryset.filter(author=user, scope='PU')
        return queryset

class PostRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        user_following = [query.following_user_id for query in  user.following.all()]
        queryset = self.queryset.filter(Q(scope='PU', author__in=user.friends.all()) |
                                        Q(scope='PU', author__in=user_following) |
                                        Q(scope='PR', author__in=user.friends.all()) |
                                        Q(author=user)).order_by("-created")
        return queryset


class PostUpdateView(generics.UpdateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset.filter(author=user)
        return queryset


class ImageCreateView(generics.CreateAPIView):
    serializer_class = ImageSerializer
    queryset = Image.objects.all()
    permission_classes = (IsAuthenticated,)


class GroupListCreateView(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset.filter(admin=user)
        return queryset

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = (IsAuthenticated,)
    lookup_field = 'id'

    def get_queryset(self):
        if Post.objects.filter(id=self.kwargs[self.lookup_field]).exists():
            post = Post.objects.get(id=self.kwargs[self.lookup_field])
        else:
            raise exceptions.NotAcceptable(
                'Post not found',
                'post_not_found'
            )
        queryset = self.queryset.filter(post__id=post.id).order_by("-created")
        return queryset
    
    def perform_create(self, serializer):
        if Post.objects.filter(id=self.kwargs[self.lookup_field]).exists():
            post = Post.objects.get(id=self.kwargs[self.lookup_field])
        else:
            raise exceptions.NotAcceptable(
                'Post not found',
                'post_not_found'
            )

        serializer.save(post=post)

class CommentRepliesListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = (IsAuthenticated,)
    lookup_field = 'id'

    def get_queryset(self):
        comment = Comment.objects.get(id= self.kwargs[self.lookup_field])
        return comment.replies.all()


class ReactListCreateView(generics.ListCreateAPIView):
    serializer_class = ReactSerializer
    queryset = React.objects.all()
    permission_classes = (IsAuthenticated,)
    lookup_field = 'id'

    def get_queryset(self):
        if Post.objects.filter(id=self.kwargs[self.lookup_field]).exists():
            post = Post.objects.get(id=self.kwargs[self.lookup_field])
        else:
            raise exceptions.NotAcceptable(
                'Post not found',
                'post_not_found'
            )
        queryset = self.queryset.filter(post__id=post.id)
        return queryset

class ReactDeleteView(generics.DestroyAPIView):
    serializer_class = ReactSerializer
    queryset = React.objects.all()
    permission_classes = (IsAuthenticated,)
    lookup_field = 'pk'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_member_to_group(request):
    current_user = request.user
    try:
        group_id = request.data.get('group_id')
        group = Group.objects.get(id=group_id)
    except:
        return Response("Group not found", status=status.HTTP_400_BAD_REQUEST)
    if group.admin.id != current_user.id:
        return Response("You are not admin of this group", status=status.HTTP_400_BAD_REQUEST)

    try:
        tobe_add_mem_id = request.data.get('member_id')
        tobe_add_mem = User.objects.get(id=tobe_add_mem_id)
    except:
        return Response("User not found", status=status.HTTP_400_BAD_REQUEST)

    group.members.add(tobe_add_mem)
    group.save()
    return Response('Add member to group successfully', status=status.HTTP_200_OK)
