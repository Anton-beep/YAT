from datetime import datetime, timezone as tz

from django.utils import timezone

from rest_framework import serializers

__all__ = []


class TimestampField(serializers.Field):
    def to_representation(self, value):
        return str(value.timestamp()).split(".")[0]

    def to_internal_value(self, data):
        if data == "":
            return None

        try:
            return datetime.fromtimestamp(int(data), tz.utc)
        except (OSError, ValueError, OverflowError, TypeError):
            raise serializers.ValidationError("Invalid timestamp")
