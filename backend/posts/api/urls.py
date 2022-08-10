from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostCreateListView.as_view()),
    path('<int:id>', views.get_all_post_of_user),
    path('edit/<int:pk>', views.PostUpdateView.as_view()),
    path('edit/add_image', views.ImageCreateView.as_view()),
    path('group/', views.GroupListCreateView.as_view()),
    path('group/add_member', views.add_member_to_group),
]
