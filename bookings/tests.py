from django.conf import settings
from django.core import mail
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from bookings.models import LicenceQuote, EditorialBooking, HeadshotBooking


class BookingTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(email='test@example.com', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        self.client.force_authenticate(user=None)

    def check_emails(self):

        # check the right amount of emails were sent
        # two emails are sent for each booking
        # (one to admin, one to user)
        self.assertEqual(len(mail.outbox), 2)

        # check the emails were sent to the right people
        sent_email = mail.outbox[0]
        self.assertEqual(sent_email.from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(sent_email.to, [settings.ADMIN_EMAIL])

        sent_email = mail.outbox[1]
        self.assertEqual(sent_email.from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(sent_email.to, [self.user.email])

    def test_create_licence_quote(self):
        url = reverse('licence_quotes')
        data = {
            'media': [],
            'name': 'Test User',
            'message': 'Test message',
        }
        response = self.client.post(url, data)
        if response.status_code != 201:
            print(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(LicenceQuote.objects.count(), 1)
        self.assertEqual(LicenceQuote.objects.get().message, 'Test message')

        self.check_emails()

    def test_create_editorial_booking(self):
        url = reverse('editorial_bookings')
        data = {
            'media_type': 'P',
            'name': 'Test User',
            'phone_number': '1234567890',
            'message': 'Test message',
        }
        response = self.client.post(url, data)
        if response.status_code != 201:
            print(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(EditorialBooking.objects.count(), 1)
        self.assertEqual(EditorialBooking.objects.get().name, 'Test User')

        self.check_emails()

    def test_create_headshot_booking(self):
        url = reverse('headshot_bookings')
        data = {
            'name': 'Test User',
            'phone_number': '1234567890',
            'message': 'Test message',
        }
        response = self.client.post(url, data)
        if response.status_code != 201:
            print(response.content)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(HeadshotBooking.objects.count(), 1)
        self.assertEqual(HeadshotBooking.objects.get().name, 'Test User')

        self.check_emails()
