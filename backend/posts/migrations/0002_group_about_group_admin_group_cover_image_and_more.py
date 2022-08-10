# Generated by Django 4.0.6 on 2022-08-03 15:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='about',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='group',
            name='admin',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='admin_groups', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='cover_image',
            field=models.ImageField(null=True, upload_to='group_images'),
        ),
        migrations.AddField(
            model_name='group',
            name='group_name',
            field=models.CharField(default='Default Group', max_length=500),
        ),
    ]