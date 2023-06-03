from django.db import models


class StockMedia(models.Model):
    """Stock media model"""

    MEDIA_CHOICES = [
        ('P', 'Photo'),
        ('V', 'Video'),
    ]
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    media_type = models.CharField(max_length=1, choices=MEDIA_CHOICES, default='P')
    # add a file field
    file = models.FileField(upload_to='stock_media')



    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # save the model first to get an id
        if not self.title:
            # if the title is not set, set it to the default
            self.title = f'PF{self.id}'
            super().save(*args, **kwargs)

    def __str__(self):
        return self.title
