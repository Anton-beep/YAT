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
    activation_token = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=False)
