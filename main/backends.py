import logging
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model


logger = logging.getLogger('api_app')
User = get_user_model()


class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, email=None, password=None, **kwargs):
        if email is None:
            email = username
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                logger.info(f'User authenticated: {email}')
                return user
        except User.DoesNotExist:
            logger.error(f'User does not exist: {email}')
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
