from django.db import models
from accounts.models import CustomUser
from media.models import StockMedia


class HeadshotBooking(models.Model):
    """Model for headshot booking requests"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200, default='Name')
    phone_number = models.CharField(max_length=50)
    message = models.TextField()

    def __str__(self):
        return f"{self.user.email}'s Headshot Booking"


class EditorialBooking(models.Model):
    """Model for editorial booking requests"""
    MEDIA_CHOICES = [
        ('P', 'Photo'),
        ('V', 'Video'),
        ('B', 'Both'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='Name')
    # email = models.EmailField()
    phone_number = models.CharField(max_length=50)
    media_type = models.CharField(max_length=1, choices=MEDIA_CHOICES, default='P')
    message = models.TextField()

    def __str__(self):
        return f"{self.user.email}'s Editorial Booking"


class LicenceQuote(models.Model):
    """Model for licence quote requests"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    media = models.ManyToManyField(StockMedia)
    name = models.CharField(max_length=200, default='Name')
    message = models.TextField()

    def __str__(self):
        return f"{self.user.email}'s Licence Request"
