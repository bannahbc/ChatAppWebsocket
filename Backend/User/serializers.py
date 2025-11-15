

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import UserProfile
from django.contrib.auth import get_user_model


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = UserProfile.EMAIL_FIELD  # 👈 Use email instead of username

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(request=self.context.get("request"), username=email, password=password)

            if not user:
                raise serializers.ValidationError(_("Invalid email or password."), code="authorization")
        else:
            raise serializers.ValidationError(_("Must include email and password."), code="authorization")

        data = super().validate(attrs)
        data["user"] = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
        }
        return data



from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    # password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'password', 'phone_number']

    def create(self, validated_data):
        user = UserProfile.objects.create_user(
            username=validated_data['username'],  # or use username if preferred
            email=validated_data['email'],
            # username=validated_data['username'],
            phone_number=validated_data.get('phone_number', ''),
            # address=validated_data.get('address', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"] 