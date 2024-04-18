from rest_framework import serializers

from homepage import models
from homepage.fields import TimestampField

__all__ = []


class UserContextSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


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
        fields = ["factor", "value"]


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
            "created",
            "scores",
        ]

    tags = serializers.PrimaryKeyRelatedField(
        queryset=models.Tag.objects.all(),
        many=True,
        required=False,
    )
    scores = ScoreSerializer(many=True, required=False)
    deadline = TimestampField(required=False)
    created = TimestampField(required=False)

    def create(self, validated_data):
        scores_data = validated_data.pop('scores')
        task = super().create(validated_data)
        for score_data in scores_data:
            score, created = models.Score.objects.get_or_create(**score_data)
            score.tasks.add(task)

        return task

    def update(self, instance, validated_data):
        scores_data = validated_data.pop('scores')
        task = super().update(instance, validated_data)
        task.scores.set([])
        for score_data in scores_data:
            score, created = models.Score.objects.get_or_create(**score_data)
            score.tasks.add(task)

        return task

    def to_internal_value(self, data):
        factors = data.pop("factors", [])
        data["scores"] = factors
        for el in data["scores"]:
            el["factor"] = el.pop("id")
        data = super().to_internal_value(data)
        return data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["factors"] = [
            {"id": score.factor.id, "value": score.value}
            for score in instance.scores.all()
        ]
        return data