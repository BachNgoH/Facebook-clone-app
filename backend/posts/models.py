from django.db import models
from base.models import User


class Group(models.Model):
    members = models.ManyToManyField(User, related_name="content_groups")
    admin = models.ForeignKey(User, related_name="admin_groups", on_delete=models.CASCADE, null=True)
    
    group_name = models.CharField(max_length=500, default="Default Group")
    about = models.TextField(blank=True, null=True)
    cover_image = models.ImageField(upload_to="group_images", null=True)

    SCOPE_CHOICES = [
        ('PU', 'PUBLIC'),
        ('PR', 'PRIVATE')
    ]

    scope = models.CharField(max_length=2, choices=SCOPE_CHOICES)


# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(User, related_name="posts", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    shared_post = models.ForeignKey("self", null=True, related_name="posts", on_delete=models.SET_NULL)
    group = models.ForeignKey(Group, null=True, on_delete=models.SET_NULL)

    SCOPE_CHOICES = [
        ('PU', 'PUBLIC'),
        ('ON', 'ONLY ME'),
        ('PR', 'PRIVATE')
    ]

    scope = models.CharField(max_length=2, choices=SCOPE_CHOICES)


class Image(models.Model):
    image = models.ImageField(null=True, upload_to="posts")
    post = models.ForeignKey(Post, related_name="images", on_delete=models.CASCADE)


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    content = models.CharField(max_length=1000)
    reply_of_comment = models.ForeignKey("self", null=True, on_delete=models.CASCADE)


class React(models.Model):
    post = models.ForeignKey(Post, related_name="reacts", on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    REACTION_CHOICES = [
        ('LIKE', 'like'),
        ('HAHA', 'haha'),
        ('LOVE', 'love'),
        ('WOWW', 'wow'),
        ('SADD', 'sad'),
        ('AGRY', 'angry')
    ]

    react_type = models.CharField(max_length=4, choices=REACTION_CHOICES)