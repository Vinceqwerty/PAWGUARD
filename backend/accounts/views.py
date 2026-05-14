from rest_framework import generics, viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .serializers import RegisterSerializer, UserSerializer, AdminUserUpdateSerializer
from .permissions import IsAdmin

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    user = get_object_or_404(User, email_verification_token=token)
    if user.is_email_verified:
        return Response({'message': 'Already verified.'})
    user.is_email_verified = True
    user.is_active = True
    user.email_verification_token = None
    user.save()
    return Response({'message': 'Email verified! You can now log in.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        token = RefreshToken(request.data['refresh'])
        token.blacklist()
        return Response({'message': 'Logged out.'})
    except Exception:
        return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class AdminUserViewSet(viewsets.ModelViewSet):
    """Admin-only: manage all user accounts and assign roles"""
    queryset = User.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return AdminUserUpdateSerializer
        return UserSerializer

    def destroy(self, request, *args, **kwargs):
        if self.get_object() == request.user:
            return Response(
                {'error': 'Cannot delete your own account.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)