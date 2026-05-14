from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.DogViewSet, basename='dogs')

urlpatterns = [
    path('dashboard/', views.dashboard_stats, name='dashboard'),
    path('',           include(router.urls)),
]