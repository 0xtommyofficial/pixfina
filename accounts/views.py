import requests
import logging
import random
import string
from captcha.image import ImageCaptcha
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from .serializers import SignupSerializer, LoginSerializer, UserDetailSerializer, \
    PasswordChangeSerializer, EmailChangeSerializer
from .models import CustomUser
from media.serializers import StockMediaSerializer
from media.models import StockMedia


logger = logging.getLogger('api_app')


class RegisterThrottle(AnonRateThrottle):
    """Throttle registration requests"""
    rate = '100/hour'


class LoginThrottle(AnonRateThrottle):
    """Throttle login requests"""
    rate = '250/hour'


class PasswordChangeThrottle(UserRateThrottle):
    """Throttle password change requests"""
    rate = '3/hour'


@api_view(['GET'])
@permission_classes([AllowAny])
def generate_captcha(request):
    image_generator = ImageCaptcha()

    # generate a random string for the captcha text
    captcha_text = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5))

    # save the captcha text in the user's session
    request.session['captcha'] = captcha_text

    # generate the captcha image
    data = image_generator.generate(captcha_text)

    return HttpResponse(data, content_type='image/png')


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterThrottle])
def register(request):
    """Register user"""
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        try:
            if settings.TESTING:
                captcha_result = True
            else:
                captcha_input = serializer.validated_data.get('captcha')
                captcha_stored = request.session.get('captcha', None)
                captcha_result = (captcha_input.lower() == captcha_stored.lower())
        except KeyError:
            logger.error('Captcha data not found')
            return Response(data={'detail': 'Captcha data not found'}, status=status.HTTP_400_BAD_REQUEST)

        if not captcha_result:
            logger.warning('Invalid CAPTCHA')
            return Response({'detail': 'Invalid CAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)

        # remove the 'captcha' field from the validated_data before saving the user
        del serializer.validated_data['captcha']

        user = serializer.save()
        user.save()
        token = Token.objects.create(user=user)
        logger.info(f'User {user.email} registered successfully')

        send_mail(
            'Welcome!',
            f'Your account has been created successfully. {settings.EMAIL_SIGNATURE}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    else:
        logger.error(f'Registration failed: {serializer.errors}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginThrottle])
def login(request):
    """Login"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, email=email, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            logger.warning('Authentication failed')
            return Response({'detail': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        logger.error('Serializer errors:', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout"""
    # remove the token for the currently authenticated user
    request.user.auth_token.delete()
    return Response({'detail': 'Logged out successfully.'}, status=200)


@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_detail(request):
    """Get or update user details."""
    if request.method == 'GET':

        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserDetailSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
            except Exception as e:
                logging.error(f'Error saving user details: {str(e)}')
                raise
            return Response(serializer.data)
        logging.warning(f'Validation failed while updating user details: {serializer.errors}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@throttle_classes([PasswordChangeThrottle])
def password_change(request):
    """Change user's password."""
    serializer = PasswordChangeSerializer(data=request.data)
    if serializer.is_valid():
        # Check old password
        if not check_password(serializer.data.get('old_password'), request.user.password):
            return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
        # set_password also hashes the password that the user will get
        request.user.set_password(serializer.data.get('new_password'))
        request.user.save()

        # send confirmation email to user
        send_mail(
            'Pixfina - Password change confirmation',
            f'Your password has been changed successfully. {settings.EMAIL_SIGNATURE}',
            settings.DEFAULT_FROM_EMAIL,
            [request.user.email],
            fail_silently=False,
        )

        return Response(status=status.HTTP_204_NO_CONTENT)
    logger.error(f'Password change failed: {serializer.errors}')
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def email_change(request):
    """Change user's email address."""
    serializer = EmailChangeSerializer(data=request.data)
    if serializer.is_valid():
        # Check password
        if not check_password(serializer.data.get('password'), request.user.password):
            return Response({'password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
        # set new email address
        request.user.email = serializer.data.get('new_email')
        request.user.save()

        # send confirmation email to new email address
        send_mail(
            'Pixfina - Email address change confirmation',
            f'Your email address has been changed successfully. {settings.EMAIL_SIGNATURE}',
            settings.DEFAULT_FROM_EMAIL,
            [request.user.email],
            fail_silently=False,
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
    logger.error(f'Email change failed: {serializer.errors}')
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_delete(request):
    """Delete user account."""
    request.user.delete()
    return Response({'detail': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def favourites_list(request):
    """Return a list of user's favourite stock media."""
    if request.method == 'GET':
        user = CustomUser.objects.get(email=request.user)
        favourites = user.favourites.all()
        serializer = StockMediaSerializer(favourites, many=True)
        return Response(serializer.data)


@api_view(['POST', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def favourite_media(request, media_id):
    """Handle POST and DELETE requests for favourite media."""
    user = CustomUser.objects.get(email=request.user)
    media_item = StockMedia.objects.get(id=media_id)

    if request.method == 'POST':
        user.favourites.add(media_item)
        return Response(status=status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        user.favourites.remove(media_item)
        return Response(status=status.HTTP_204_NO_CONTENT)
