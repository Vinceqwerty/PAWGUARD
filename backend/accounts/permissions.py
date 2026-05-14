from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Only users with role='admin'"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsAdminOrOwner(BasePermission):
    """Admins: full access. Others: only their own objects."""
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return hasattr(obj, 'owner') and obj.owner == request.user


class IsEmailVerified(BasePermission):
    message = 'Please verify your email address first.'

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_email_verified