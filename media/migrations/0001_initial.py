# Generated by Django 4.2.1 on 2023-05-31 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StockMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=200)),
                ('description', models.TextField()),
                ('media_type', models.CharField(choices=[('P', 'Photo'), ('V', 'Video')], default='P', max_length=1)),
            ],
        ),
    ]
