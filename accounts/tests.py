from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token


class AccountTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(email='test@example.com', password='testpassword')
        self.token = Token.objects.create(user=self.user)

    def test_register_user(self):
        User = get_user_model()
        # ensure the user doesn't already exist
        User.objects.filter(email='test@example.com').delete()

        url = reverse('register')
        data = {
            'first_name': 'test',
            'last_name': 'test',
            'email': 'test@example.com',
            'password': 'testpassword',
            'captcha': 'PASSED',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        url = reverse('login')
        data = {
            'email': 'test@example.com',
            'password': 'testpassword',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_logout_user(self):
        url = reverse('logout')
        # authenticate the user before logout
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Logged out successfully.')

        # check that the token has been deleted
        with self.assertRaises(Token.DoesNotExist):
            self.token.refresh_from_db()
