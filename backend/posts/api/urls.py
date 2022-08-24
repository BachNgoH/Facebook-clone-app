from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostCreateListView.as_view()),
    path('<slug:id>', views.PostByUserListView.as_view()),
    path('rev/<slug:pk>', views.PostRetrieveAPIView.as_view()),
    path('edit/<slug:pk>', views.PostUpdateView.as_view()),
    path('edit/add_image', views.ImageCreateView.as_view()),
    path('group/', views.GroupListCreateView.as_view()),
    path('group/add_member', views.add_member_to_group),
    path('comment/<slug:id>', views.CommentListCreateView.as_view()),
    path('comment/replies/<slug:id>', views.CommentRepliesListView.as_view()),
    path('react/', views.ReactListCreateView.as_view()),
    path('react/delete/<slug:pk>', views.ReactDeleteView.as_view()),
    path('react/<slug:id>', views.ReactListCreateView.as_view()),
]
