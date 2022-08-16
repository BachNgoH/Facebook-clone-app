from urllib import request
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from posts.models import Post
from base.models import User
from base.serializers import UserSerializer
from posts.serializers import PostSerializer
from django.db.models import Q

# Create your views here.

class SearchPostListAPIView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        results = Post.objects.none()

        q = self.request.GET.get('q')
        num = self.request.GET.get('n')
        if q is not None:
            user = self.request.user
            user_following = [query.following_user_id for query in  user.following.all()]

            results = self.queryset.filter(Q(scope='PU', author__in=user.friends.all()) |
                                            Q(scope='PU', author__in=user_following) |
                                            Q(scope='PR', author__in=user.friends.all()), content__icontains=q).order_by("-created")
            if num is not None:
                results = results[:int(num)]
        return results

class SearchUserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        q = self.request.GET.get('q')
        num = self.request.GET.get('n')
        qs = super().get_queryset()
        if q is not None:
            for term in q.split():
                qs = qs.filter(Q(first_name__icontains = term)| Q(last_name__icontains = term), is_verified=True)
            if num is not None:
                qs = qs[:int(num)]
        return qs