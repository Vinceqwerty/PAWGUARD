from django.contrib import admin
from .models import Dog


@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    list_display  = ['name', 'breed', 'owner', 'status', 'is_vaccinated', 'created_at']
    list_filter   = ['status', 'breed', 'gender', 'size', 'is_vaccinated']
    search_fields = ['name', 'breed', 'microchip_id']