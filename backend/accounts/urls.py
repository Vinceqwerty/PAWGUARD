from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('users', views.AdminUserViewSet, basename='users')

urlpatterns = [
    path('register/',                 views.RegisterView.as_view(), name='register'),
    path('verify-email/<str:token>/', views.verify_email,           name='verify-email'),
    path('me/',                       views.me,                     name='me'),
    path('logout/',                   views.logout_view,            name='logout'),
    path('',                          include(router.urls)),
]