# Generated by Django 5.0 on 2024-04-10 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_remove_user_username_alter_user_email"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="activation_token",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
