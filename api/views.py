from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.conf import settings
from django.contrib.auth import authenticate, logout
from .serializers import SignupSerializer, LoginSerializer
import requests


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
def register(request):
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        try:
            captcha_response = serializer.validated_data.get('captcha')
            captcha_result = verify_recaptcha(captcha_response)
        except KeyError:
            return Response(data={"detail": "Captcha data not found"}, status=status.HTTP_400_BAD_REQUEST)

        if not captcha_result:
            return Response({'detail': 'Invalid CAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)

        # remove the 'captcha' field from the validated_data before saving the user
        del serializer.validated_data['captcha']

        user = serializer.save()
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    print(f'login view called: {request.data}')
    if serializer.is_valid():
        email = serializer.validated_data['email']
        print(f'email in login view: {email}')
        password = serializer.validated_data['password']
        user = authenticate(request, email=email, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            print("Authentication failed")  # Add this print statement
            return Response({'detail': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout(request):
    logout(request)
    return Response({"detail": "Logged out successfully."})
