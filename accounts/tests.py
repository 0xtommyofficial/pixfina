from django.conf import settings
from django.core import mail
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from media.models import StockMedia


class AccountTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(email='test@example.com', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

        # Create some StockMedia object
        # self.media1 = StockMedia.objects.create(description='Test Media 1', media_type='P')
        # self.media2 = StockMedia.objects.create(description='Test Media 2', media_type='V')
        # self.media3 = StockMedia.objects.create(description='Test Media 3', media_type='P')

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

        # check that only one email was sent
        self.assertEqual(len(mail.outbox), 1)

        # get the last message in the outbox
        mail_sent = mail.outbox[0]
        self.assertEqual(mail_sent.subject, 'Welcome!')
        self.assertEqual(mail_sent.to, ['test@example.com'])

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

        # check that only one email was sent
        self.assertEqual(len(mail.outbox), 1)

        # get the last message in the outbox
        mail_sent = mail.outbox[0]
        self.assertEqual(mail_sent.from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(mail_sent.to, [self.user.email])

    def test_email_change(self):
        data = {'password': 'testpassword', 'new_email': 'newemail@test.com'}
        response = self.client.put(reverse('email_change'), data=data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'newemail@test.com')

        # check that only one email was sent
        self.assertEqual(len(mail.outbox), 1)

        # get the last message in the outbox
        mail_sent = mail.outbox[0]
        self.assertEqual(mail_sent.from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(mail_sent.to, ['newemail@test.com'])

    def test_user_delete(self):
        response = self.client.delete(reverse('user_delete'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(get_user_model().DoesNotExist):
            get_user_model().objects.get(email='test@example.com')

    # def test_favourites_list(self):
    #     # add a favourite for the user
    #     self.user.favourites.add(self.media1)
    #
    #     # get the list of favourites
    #     response = self.client.get(reverse('favourites_list'))
    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual(len(response.data), 1)
    #     self.assertEqual(response.data[0]['title'], self.media1.title)
    #
    # def test_favourite_media(self):
    #     # favourite a media item
    #     response = self.client.post(reverse('favourite_media', args=[self.media2.id]))
    #     self.assertEqual(response.status_code, 201)
    #
    #     # check that the media item is now a favourite
    #     response = self.client.get(reverse('favourites_list'))
    #     self.assertEqual(len(response.data), 1)
    #     self.assertEqual(response.data[0]['title'], self.media2.title)
    #
    #     # unfavourite the media item
    #     response = self.client.delete(reverse('favourite_media', args=[self.media2.id]))
    #     self.assertEqual(response.status_code, 204)
    #
    #     # check that the media item is no longer a favourite
    #     response = self.client.get(reverse('favourites_list'))
    #     self.assertEqual(len(response.data), 0)
