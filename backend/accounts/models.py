from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('dog_owner', 'Dog Owner'),
        ('event_manager', 'Event Manager'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='dog_owner')
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=64, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Log in with email instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_full_name()} [{self.role}]"