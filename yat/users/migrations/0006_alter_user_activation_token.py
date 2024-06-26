# Generated by Django 5.0 on 2024-04-15 20:39

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0005_alter_user_managers_alter_user_activation_token"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="activation_token",
            field=models.UUIDField(blank=True, default=uuid.uuid4),
        ),
    ]
