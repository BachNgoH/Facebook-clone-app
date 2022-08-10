from django.urls import reverse
from rest_framework import serializers
from base.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from base.models import Profile

base_url = "localhost:8000"

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    is_verified = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 
                'is_verified', 'password', 'password2',)
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):

        user = User.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_verified=False,
        )

        user.set_password(validated_data['password'])
        
        profile = Profile.objects.create(user=user)

        confirmation_token = default_token_generator.make_token(user)
        activation_link = f'{base_url}{reverse("activation")}?user_id={user.id}&confirmation_token={confirmation_token}'

        
        user.email_user('Verify Your Email',
                        f'Please Verify Your email here {activation_link}')
        user.save()
        profile.save()

        return user
