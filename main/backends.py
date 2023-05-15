from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, email=None, password=None, **kwargs):
        if email is None:
            email = username
        print(f'Authenticate method called, email: {email}')
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                print(f'User authenticated: {user}')
                return user
        except User.DoesNotExist:
            print('User does not exist')
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
