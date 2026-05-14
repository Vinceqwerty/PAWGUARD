from django.db import models
from django.conf import settings
import uuid


class Dog(models.Model):
    SIZE_CHOICES = [
        ('small', 'Small'), ('medium', 'Medium'),
        ('large', 'Large'), ('extra_large', 'Extra Large'),
    ]
    GENDER_CHOICES = [('male', 'Male'), ('female', 'Female')]
    STATUS_CHOICES = [
        ('active', 'Active'), ('inactive', 'Inactive'),
        ('adopted', 'Adopted'), ('lost', 'Lost'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dogs'
    )
    name = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    age = models.PositiveIntegerField(help_text='Age in months')
    weight = models.DecimalField(max_digits=5, decimal_places=2, help_text='Weight in kg')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    size = models.CharField(max_length=15, choices=SIZE_CHOICES)
    color = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    photo = models.ImageField(upload_to='dogs/', blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')
    is_vaccinated = models.BooleanField(default=False)
    vaccination_date = models.DateField(null=True, blank=True)
    microchip_id = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.breed})"