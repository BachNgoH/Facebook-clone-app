from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from posts.models import Group, Image, Post
from base.models import User
from posts.serializers import GroupSerializer, ImageSerializer, PostSerializer
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status



class PostCreateListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        user_following = [query.following_user_id for query in  user.following.all()]
        queryset = self.queryset.filter(Q(scope='PU', author__in=user.friends.all()) |
                                        Q(scope='PU', author__in=user_following) |
                                        Q(scope='PR', author__in=user.friends.all()))
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_post_of_user(request, id):
    current_user = request.user
    if User.objects.filter(id=id).exists():
        user = User.objects.get(id=id)

    if (user.id == current_user.id):
        posts = Post.objects.filter(author=user).order_by("-created")
    elif (user in current_user.friends):
        posts = Post.objects.filter(Q(scope='PU', author=user) | Q(
            scope='PR', author=user)).order_by("-created")
    else:
        posts = Post.objects.filter(author=user, scope='PU')

    return Response(PostSerializer(posts, many=True).data, status=status.HTTP_200_OK)
