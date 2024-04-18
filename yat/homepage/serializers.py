from rest_framework import serializers

from homepage import models
from homepage.fields import TimestampField

__all__ = []


class UserContextSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return self.Meta.model.objects.create(
            user=self.context["request"].user,
            **validated_data,
        )


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


class NoteSerializer(UserContextSerializer):
    class Meta:
        model = models.Note
        fields = ["id", "name", "description"]


class FactorSerializer(UserContextSerializer):
    class Meta:
        model = models.Factor
        fields = ["id", "name", "visible"]


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Score
        fields = ["id", "value"]

    id = serializers.IntegerField(required=False)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class TaskSerializer(UserContextSerializer):
    class Meta:
        model = models.Task
        fields = [
            "id",
            "name",
            "description",
            "tags",
            "status",
            "deadline",
            "factors",
            "created",
            "scores",
        ]

    scores = serializers.SerializerMethodField()
    factors = ScoreSerializer(many=True, required=False)
    deadline = TimestampField(required=False)
    created = TimestampField(required=False)

    @staticmethod
    def get_scores(obj):
        return [
            {"id": score.factor.id, "value": score.value}
            for score in obj.scores.all()
        ]

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", [])
        factors = validated_data.pop("factors", [])
        task = super().update(instance, validated_data)
        task.tags.set(tags)
        task.scores.set([])
        for factor in factors:
            score, created = models.Score.objects.get_or_create(
                factor_id=factor["id"],
                value=factor["value"],
            )
            score.tasks.add(task)

        return task

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        factors = validated_data.pop("factors", [])
        task = super().create(validated_data)
        task.tags.set(tags)
        for factor in factors:
            score, created = models.Score.objects.get_or_create(
                factor_id=factor["id"],
                value=factor["value"],
            )
            score.tasks.add(task)

        return task
