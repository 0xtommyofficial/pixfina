from django.db import models
from django.contrib.auth import get_user_model
from media.models import StockMedia

User = get_user_model()


class HeadshotBooking(models.Model):
    """Model for headshot booking requests"""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(max_length=50)
    message = models.TextField()


class EditorialBooking(models.Model):
    """Model for editorial booking requests"""
    MEDIA_CHOICES = [
        ('P', 'Photo'),
        ('V', 'Video'),
    ]
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(max_length=50)
    media_type = models.CharField(max_length=1, choices=MEDIA_CHOICES, default='P')
    message = models.TextField()

    def __str__(self):
        return f"{self.user.email}'s Editorial Booking"


class LicenceQuote(models.Model):
    """Model for licence quote requests"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    media = models.ManyToManyField(StockMedia)
    message = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s licence Request"
