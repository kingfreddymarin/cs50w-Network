# Generated by Django 4.1.2 on 2022-11-25 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_profile_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(null=True, related_name='likedPost', to='network.profile'),
        ),
    ]
