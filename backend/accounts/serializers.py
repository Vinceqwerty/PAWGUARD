from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
import secrets

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name',
                  'password', 'password2', 'role', 'phone_number']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        token = secrets.token_hex(32)
        user = User.objects.create_user(
            **validated_data,
            is_active=False,                   # Inactive until email verified
            email_verification_token=token,
        )
        verify_url = f"http://localhost:8000/api/accounts/verify-email/{token}/"
        send_mail(
            subject='Verify your PawTrack account',
            message=f'Hi {user.first_name},\n\nVerify here:\n{verify_url}',
            from_email='noreply@pawtrack.com',
            recipient_list=[user.email],
            fail_silently=True,
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'full_name', 'role', 'is_email_verified', 'phone_number', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_email_verified']

    def get_full_name(self, obj):
        return obj.get_full_name()


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Admin-only: change role and active status"""
    class Meta:
        model = User
        fields = ['role', 'is_active', 'first_name', 'last_name', 'phone_number']