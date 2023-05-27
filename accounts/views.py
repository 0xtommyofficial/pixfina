import requests
import logging
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
from .serializers import SignupSerializer, LoginSerializer, UserDetailSerializer, \
    PasswordChangeSerializer, EmailChangeSerializer


logger = logging.getLogger('api_app')


class RegisterThrottle(AnonRateThrottle):
    rate = '100/hour'


class LoginThrottle(AnonRateThrottle):
    rate = '250/hour'


class PasswordChangeThrottle(UserRateThrottle):
    rate = '3/hour'


def verify_recaptcha(captcha_response):
    data = {
        'secret': settings.RECAPTCHA_SECRET_KEY,
        'response': captcha_response,
    }
    response = requests.post(settings.RECAPTCHA_VERIFY_URL, data=data)
    try:
        result = response.json()
        return result.get('success', False)
    except ValueError:
        return False


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterThrottle])
def register(request):
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        try:
            if settings.TESTING:
                captcha_result = True
            else:
                captcha_response = serializer.validated_data.get('captcha')
                captcha_result = verify_recaptcha(captcha_response)
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
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    else:
        logger.error(f'Registration failed: {serializer.errors}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginThrottle])
def login(request):
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
    # remove the token for the currently authenticated user
    request.user.auth_token.delete()
    return Response({'detail': 'Logged out successfully.'}, status=200)


# User detail view
@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_detail(request):
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


# Password change view
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@throttle_classes([PasswordChangeThrottle])
def password_change(request):
    serializer = PasswordChangeSerializer(data=request.data)
    if serializer.is_valid():
        # Check old password
        if not check_password(serializer.data.get('old_password'), request.user.password):
            return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
        # set_password also hashes the password that the user will get
        request.user.set_password(serializer.data.get('new_password'))
        request.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    logger.error(f'Password change failed: {serializer.errors}')
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Email change view
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def email_change(request):
    serializer = EmailChangeSerializer(data=request.data)
    if serializer.is_valid():
        # Check password
        if not check_password(serializer.data.get('password'), request.user.password):
            return Response({'password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
        # TODO: Send confirmation email to new email address
        request.user.email = serializer.data.get('new_email')
        request.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    logger.error(f'Email change failed: {serializer.errors}')
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User delete view
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_delete(request):
    request.user.delete()
    return Response({'detail': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
