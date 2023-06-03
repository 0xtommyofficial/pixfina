from rest_framework import serializers
from .models import LicenceQuote, StockMedia, EditorialBooking, HeadshotBooking


class LicenceQuoteSerializer(serializers.ModelSerializer):
    """Serializer for licenceQuote model"""
    media = serializers.PrimaryKeyRelatedField(many=True, queryset=StockMedia.objects.all())

    class Meta:
        model = LicenceQuote
        fields = ['user', 'media', 'message']


class EditorialBookingSerializer(serializers.ModelSerializer):
    """Serializer for EditorialBooking model"""
    class Meta:
        model = EditorialBooking
        fields = ['name', 'email', 'phone_number', 'media_type', 'message']
        read_only_fields = ['user']


class HeadshotBookingSerializer(serializers.ModelSerializer):
    """Serializer for HeadshotBooking model"""
    class Meta:
        model = HeadshotBooking
        fields = ['name', 'email', 'phone_number', 'message']
