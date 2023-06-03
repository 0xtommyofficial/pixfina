import logging
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import LicenceQuote, EditorialBooking, HeadshotBooking
from .serializers import LicenceQuoteSerializer, EditorialBookingSerializer, HeadshotBookingSerializer


logger = logging.getLogger('api_app')


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def licence_quote_list(request):
    """List all licence quotes or create a new one"""
    if request.method == 'GET':
        quotes = LicenceQuote.objects.filter(user=request.user)
        serializer = LicenceQuoteSerializer(quotes, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = LicenceQuoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def editorial_booking_list(request):
    """List all editorial bookings or create a new one"""
    if request.method == 'GET':
        bookings = EditorialBooking.objects.filter(user=request.user)
        serializer = EditorialBookingSerializer(bookings, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EditorialBookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def headshot_booking_list(request):
    """List all headshot bookings or create a new one"""
    if request.method == 'GET':
        bookings = HeadshotBooking.objects.filter(email=request.user.email)
        serializer = HeadshotBookingSerializer(bookings, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = HeadshotBookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
