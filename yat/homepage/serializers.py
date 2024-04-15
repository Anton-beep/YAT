from rest_framework import serializers

from homepage import models


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Activity
        fields = "__all__"

    def create(self, validated_data):
        return models.Activity.objects.create(**validated_data)

    def update(self, instance: models.Activity, validated_data: dict[str, str]):
        instance.user = validated_data.get("user", instance.user)
        instance.name = validated_data.get("name", instance.name)
        instance.icon_name = validated_data.get("icon_name", instance.icon_name)
        instance.icon_color = validated_data.get("icon_color", instance.icon_color)
        instance.user = validated_data.get("user", instance.user)
        instance.save()
        return instance

