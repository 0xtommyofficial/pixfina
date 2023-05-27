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
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        self.client.force_authenticate(user=None)

    def test_register_user(self):
        user = get_user_model()
        # ensure the user doesn't already exist
        user.objects.filter(email='test@example.com').delete()

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
        # self.client.force_authenticate(user=self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Logged out successfully.')

        # check that the token has been deleted
        with self.assertRaises(Token.DoesNotExist):
            self.token.refresh_from_db()

    def test_get_user_detail(self):
        response = self.client.get(reverse('user_detail'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user_detail(self):
        data = {'first_name': 'New Name'}
        response = self.client.put(reverse('user_detail'), data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'New Name')

    def test_password_change(self):
        data = {'old_password': 'testpassword', 'new_password': 'ComplexPassword123',
                'new_password_repeat': 'ComplexPassword123'}
        response = self.client.put(reverse('password_change'), data=data)
        if response.status_code != status.HTTP_204_NO_CONTENT:
            print(response.content)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(self.user.check_password('ComplexPassword123'))

    def test_email_change(self):
        data = {'password': 'testpassword', 'new_email': 'newemail@test.com'}
        response = self.client.put(reverse('email_change'), data=data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'newemail@test.com')

    def test_user_delete(self):
        response = self.client.delete(reverse('user_delete'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(get_user_model().DoesNotExist):
            get_user_model().objects.get(email='test@example.com')
