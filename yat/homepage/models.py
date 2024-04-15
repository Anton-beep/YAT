from django.conf import settings
from django.db import models


class Activity(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="activities",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=50)
    icon_name = models.CharField(max_length=50)
    icon_color = models.CharField(max_length=50)
    visible = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"Активность {self.name}"
