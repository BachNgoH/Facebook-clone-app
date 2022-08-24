from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserListView.as_view()),
    path('profiles/', views.ProfileCreateView.as_view()),
    path('profiles/current', views.CurrentUserRetrieveView.as_view()),
    path('profiles/update', views.ProfileUpdateView.as_view()),
    path('profiles/<slug:pk>', views.UserRetriveView.as_view()),
    path('follow/<slug:id>', views.follow),
    path('follow/following', views.get_following),
    path('follow/followers', views.get_followers),
    path('unfollow/<slug:id>', views.unfollow),
    path('friends/', views.get_all_friends),
    path('friends/add/<slug:id>', views.send_friend_request),
    path('friends/accept/<slug:id>', views.accept_friend_request),
    path('friends/delreq/<slug:id>', views.delete_friend_request),
    path('friends/requests', views.get_all_friend_requests),
    path('friends/unfriend/<slug:id>', views.unfriend),
]