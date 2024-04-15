import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from users.managers import UserManager

__all__ = []


class User(AbstractUser):
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    username = None
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    activation_token = models.UUIDField(blank=True, default=uuid.uuid4)
