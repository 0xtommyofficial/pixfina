from django.contrib import admin
from .models import StockMedia


@admin.register(StockMedia)
class StockMediaAdmin(admin.ModelAdmin):
    fields = ('title', 'description', 'media_type',)
