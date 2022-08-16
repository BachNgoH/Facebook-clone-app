from django.urls import path

from . import views

urlpatterns = [
    path('posts/', views.SearchPostListAPIView.as_view(), name='search'),
    path('user/', views.SearchUserListAPIView.as_view(), name='search')
]
