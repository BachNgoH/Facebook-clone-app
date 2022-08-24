from distutils.command.upload import upload
from email.policy import default
import uuid
from django.db import models

# Create your models here.
from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.core.mail import send_mail, EmailMessage
from django.dispatch import receiver
from django.db.models.signals import post_save
import uuid 
from base.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_joined = models.DateTimeField(auto_now_add=True, null=True)
    is_verified = models.BooleanField(default=False, null=True)
    friends = models.ManyToManyField("self")

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        '''
        Returns the first_name plus the last_name, with a space in between.
        '''
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        '''
        Returns the short name for the user.
        '''
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this User.
        '''
        message = EmailMessage(subject, message, from_email, [self.email], **kwargs)
        message.content_subtype = 'html'
        message.send()

    def __str__(self) -> str:
        return self.first_name + ' '+ self.last_name

class UserFollow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    following_user_id = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

class UserFriendRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_sender = models.ForeignKey(User, related_name="sent_requests", on_delete=models.CASCADE)
    user_receiver = models.ForeignKey(User, related_name="friend_requests", on_delete=models.CASCADE)

    accepted = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    

class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField(null=True)
    bio = models.TextField(blank=True, null=True)
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Others')
    ]

    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        null=True
    )

    profile_image = models.ImageField(null=True, upload_to='profiles', default="../files/profiles/default-profile-picture1.jpg")
    cover_image = models.ImageField(null=True, upload_to='profiles', default="../files/profiles/default-cover-6.jpg")
