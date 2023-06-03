from rest_framework import serializers
from .models import StockMedia


class StockMediaSerializer(serializers.ModelSerializer):
    """Serializer for StockMedia model"""
    class Meta:
        model = StockMedia
        fields = '__all__'
