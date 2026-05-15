from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_email_verified', 'is_active']
    list_filter  = ['role', 'is_email_verified', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('PawGuard', {'fields': ('role', 'is_email_verified', 'phone_number')}),
    )