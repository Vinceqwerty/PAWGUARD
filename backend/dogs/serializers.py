from rest_framework import serializers
from .models import Dog


class DogSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    age_display = serializers.SerializerMethodField()

    class Meta:
        model = Dog
        fields = [
            'id', 'owner', 'owner_name', 'name', 'breed', 'age', 'age_display',
            'weight', 'gender', 'size', 'color', 'description', 'photo',
            'status', 'is_vaccinated', 'vaccination_date', 'microchip_id',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def get_owner_name(self, obj):
        return obj.owner.get_full_name()

    def get_age_display(self, obj):
        y, m = divmod(obj.age, 12)
        if y == 0: return f"{m} month{'s' if m != 1 else ''}"
        if m == 0: return f"{y} year{'s' if y != 1 else ''}"
        return f"{y}y {m}m"

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)