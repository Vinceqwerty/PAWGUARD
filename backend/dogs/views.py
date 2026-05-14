from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Dog
from .serializers import DogSerializer
from accounts.permissions import IsAdminOrOwner, IsEmailVerified


class DogViewSet(viewsets.ModelViewSet):
    serializer_class = DogSerializer
    permission_classes = [IsAuthenticated, IsEmailVerified, IsAdminOrOwner]
    filterset_fields = ['status', 'breed', 'gender', 'size', 'is_vaccinated']
    search_fields = ['name', 'breed', 'color', 'microchip_id']
    ordering_fields = ['name', 'created_at', 'age', 'weight']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Dog.objects.all().select_related('owner')
        if user.role == 'event_manager':
            return Dog.objects.filter(status='active').select_related('owner')
        return Dog.objects.filter(owner=user).select_related('owner')

    @action(detail=False, methods=['get'])
    def stats(self, request):
        qs = self.get_queryset()
        return Response({
            'total': qs.count(),
            'active': qs.filter(status='active').count(),
            'vaccinated': qs.filter(is_vaccinated=True).count(),
            'by_status': {s: qs.filter(status=s).count() for s, _ in Dog.STATUS_CHOICES},
            'by_size':   {s: qs.filter(size=s).count()   for s, _ in Dog.SIZE_CHOICES},
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    dogs = Dog.objects.all() if request.user.role == 'admin' else Dog.objects.filter(owner=request.user)
    data = {
        'dogs': {
            'total': dogs.count(),
            'active': dogs.filter(status='active').count(),
            'vaccinated': dogs.filter(is_vaccinated=True).count(),
        }
    }
    if request.user.role == 'admin':
        data['users'] = {
            'total': User.objects.count(),
            'admins': User.objects.filter(role='admin').count(),
            'dog_owners': User.objects.filter(role='dog_owner').count(),
            'event_managers': User.objects.filter(role='event_manager').count(),
        }
    return Response(data)