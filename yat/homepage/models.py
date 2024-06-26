from django.conf import settings
from django.db import models

__all__ = []


class Activity(models.Model):
    name = models.CharField(max_length=50)
    icon_name = models.CharField(max_length=50)
    icon_color = models.CharField(max_length=50)
    visible = models.BooleanField(default=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="activities",
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"Активность {self.name}"


class Tag(models.Model):
    name = models.CharField(max_length=50)
    visible = models.BooleanField(default=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="tags",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f"Тег {self.name}"


class Note(models.Model):
    name = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now=True)
    description = models.TextField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="notes",
        on_delete=models.CASCADE,
    )
    tags = models.ManyToManyField(Tag, related_name="notes")

    def __str__(self):
        return f"Примечание: {self.name}"


class Factor(models.Model):
    name = models.CharField(max_length=100)
    visible = models.BooleanField(default=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="factors",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f"Фактор: {self.name}"


class Score(models.Model):
    value = models.IntegerField()
    factor = models.ForeignKey(
        Factor,
        related_name="scores",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f"Оценка фактора {self.factor.name}: {self.value}"


class Task(models.Model):
    class Statuses(models.TextChoices):
        DONE = "done", "Выполнена"
        NOT_DONE = "not done", "Не выполнена"

    name = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(
        max_length=10,
        choices=Statuses,
        default=Statuses.NOT_DONE,
    )
    created = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(blank=True, null=True)
    done = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="tasks",
        on_delete=models.CASCADE,
    )
    tags = models.ManyToManyField(Tag, related_name="tasks")
    scores = models.ManyToManyField(Score, related_name="tasks", blank=True)

    def __str__(self):
        return f"Задача: {self.name}"


class Event(models.Model):
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    finished = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="events",
        on_delete=models.CASCADE,
    )
    tags = models.ManyToManyField(Tag, related_name="events")
    activity = models.ForeignKey(
        Activity,
        related_name="events",
        on_delete=models.CASCADE,
    )
    scores = models.ManyToManyField(Score, related_name="events", blank=True)

    def __str__(self):
        return f"Событие: {self.description}"
