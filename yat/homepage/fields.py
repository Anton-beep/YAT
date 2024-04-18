from datetime import datetime

from django.utils import timezone
from rest_framework import serializers

__all__ = []


class TimestampField(serializers.Field):
    def to_representation(self, value):
        return str(value.timestamp()).split(".")[0]

    def to_internal_value(self, data):
        return timezone.make_aware(datetime.fromtimestamp(int(data)))
