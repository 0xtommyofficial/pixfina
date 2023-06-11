import logging
from django.conf import settings
from django.core.mail import send_mail
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
            quote = serializer.save(user=request.user)

            admin_email_message = f'''
            User: {request.user}
            Name: {quote.name}
            Media: {[media.title for media in quote.media.all()]}
            Message: {quote.message}
            '''

            user_email_message = f'''
            Your request details:
            Media: {[media.title for media in quote.media.all()]}
            Message: {quote.message}
            
            Thank you for your stock media request. We will get back to you as soon as possible.
            {settings.EMAIL_SIGNATURE}
            '''

            # TODO: For medium to high traffic,
            #  use Celery with Redis to send emails asynchronously
            #   Below is purely for demonstration purposes and low traffic only
            send_mail(
                subject='Stock media request',
                message=admin_email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=False,
            )

            send_mail(
                subject='Pixfina - Stock media request',
                message=user_email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                fail_silently=False,
            )

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
            booking = serializer.save(user=request.user)

            admin_email_message = f'''
            User: {request.user}
            Media type: {booking.media_type}
            Name: {booking.name}
            Email: {request.user.email}
            Phone number: {booking.phone_number}
            Message: {booking.message}
            '''

            client_email_message = f'''
            Your booking details:
            Media type: {booking.media_type}
            Name: {booking.name}
            Phone number: {booking.phone_number}
            Message: {booking.message}
            
            Thank you for your booking request. We will get back to you as soon as possible.
            {settings.EMAIL_SIGNATURE}
            '''

            send_mail(
                subject='Editorial booking request',
                message=admin_email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=False,
            )

            send_mail(
                subject='Pixfina - Editorial booking request',
                message=client_email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                fail_silently=False,
            )

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
            booking = serializer.save(user=request.user)

            admin_email_message = f'''
            User: {request.user}
            Name: {booking.name}
            Phone number: {booking.phone_number}
            Message: {booking.message}
            '''

            client_email_message = f'''
            Your booking details:
            Name: {booking.name}
            Phone number: {booking.phone_number}
            Message: {booking.message}
            
            Thank you for your booking request. We will get back to you as soon as possible.
            {settings.EMAIL_SIGNATURE}
            '''

            send_mail(
                subject='Headshot booking request',
                message=admin_email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=False,
            )

            send_mail(
                subject='Pixfina - Headshot booking request',
                message=client_email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                fail_silently=False,
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
