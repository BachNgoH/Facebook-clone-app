from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostCreateListView.as_view()),
    path('<int:id>', views.PostByUserListView.as_view()),
    path('rev/<int:pk>', views.PostRetrieveAPIView.as_view()),
    path('edit/<int:pk>', views.PostUpdateView.as_view()),
    path('edit/add_image', views.ImageCreateView.as_view()),
    path('group/', views.GroupListCreateView.as_view()),
    path('group/add_member', views.add_member_to_group),
    path('comment/<int:id>', views.CommentListCreateView.as_view()),
    path('comment/replies/<int:id>', views.CommentRepliesListView.as_view()),
    path('react/', views.ReactListCreateView.as_view()),
    path('react/delete/<int:pk>', views.ReactDeleteView.as_view()),
    path('react/<int:id>', views.ReactListCreateView.as_view()),
]
