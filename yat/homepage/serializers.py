from rest_framework import serializers

from homepage import models

__all__ = []


class UserContextSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return self.Meta.model.objects.create(
            user=self.context["request"].user,
            **validated_data,
        )

    def update(self, instance: models.Tag, validated_data: dict[str, str]):
        instance.name = validated_data.get("name", instance.name)
        instance.save()
        return instance


class ActivitySerializer(UserContextSerializer):
    class Meta:
        model = models.Activity
        fields = ["id", "name", "icon", "icon_name", "icon_color"]

    icon = serializers.SerializerMethodField()

    @staticmethod
    def get_icon(obj):
        return {
            "name": obj.icon_name,
            "color": obj.icon_color,
        }

    def to_internal_value(self, data):
        icon = data.pop("icon", None)
        if icon is not None:
            data["icon_name"] = icon.get("name")
            data["icon_color"] = icon.get("color")

        return super().to_internal_value(data)

    def update(
        self,
        instance: models.Activity,
        validated_data: dict[str, str],
    ):
        instance.icon_name = validated_data.get(
            "icon_name",
            instance.icon_name,
        )
        instance.icon_color = validated_data.get(
            "icon_color",
            instance.icon_color,
        )
        return super().update(instance, validated_data)


class TagSerializer(UserContextSerializer):
    class Meta:
        model = models.Tag
        fields = ["id", "name", "visible"]
