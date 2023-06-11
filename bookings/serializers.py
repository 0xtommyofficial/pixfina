from rest_framework import serializers
from .models import LicenceQuote, StockMedia, EditorialBooking, HeadshotBooking


class LicenceQuoteSerializer(serializers.ModelSerializer):
    """Serializer for licenceQuote model"""
    media = serializers.PrimaryKeyRelatedField(many=True, queryset=StockMedia.objects.all())

    class Meta:
        model = LicenceQuote
        fields = ['media', 'name', 'message']
        read_only_fields = ['user']


class EditorialBookingSerializer(serializers.ModelSerializer):
    """Serializer for EditorialBooking model"""
    class Meta:
        model = EditorialBooking
        fields = ['media_type', 'name', 'phone_number', 'message']
        read_only_fields = ['user']


class HeadshotBookingSerializer(serializers.ModelSerializer):
    """Serializer for HeadshotBooking model"""
    class Meta:
        model = HeadshotBooking
        fields = ['name', 'phone_number', 'message']
        read_only_fields = ['user']
