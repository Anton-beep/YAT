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


class SerializerWithTagsAndScores(UserContextSerializer):
    class Meta:
        fields = []

    tags = serializers.PrimaryKeyRelatedField(
        queryset=models.Tag.objects.all(),
        many=True,
        required=False,
    )
    scores = ScoreSerializer(many=True, required=False)

    def __init__(self, *args, **kwargs):
        assert "tags" in self.Meta.fields, "tags field is required"
        assert "scores" in self.Meta.fields, "scores field is required"
        super().__init__(*args, **kwargs)

    def to_internal_value(self, data):
        factors = data.pop("factors", [])
        data["scores"] = factors
        for el in data["scores"]:
            el["factor"] = el.pop("id")

        return super().to_internal_value(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["factors"] = [
            {"id": score.factor.id, "value": score.value}
            for score in instance.scores.all()
        ]
        return data


class TaskSerializer(SerializerWithTagsAndScores):
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

    deadline = TimestampField(required=False)
    created = TimestampField(required=False)

    def create(self, validated_data):
        scores_data = validated_data.pop("scores")
        task = super().create(validated_data)
        for score_data in scores_data:
            score, created = models.Score.objects.get_or_create(**score_data)
            score.tasks.add(task)

        return task

    def update(self, instance, validated_data):
        scores_data = validated_data.pop("scores")
        task = super().update(instance, validated_data)
        task.scores.set([])
        for score_data in scores_data:
            score, created = models.Score.objects.get_or_create(**score_data)
            score.tasks.add(task)

        return task


class EventSerializer(SerializerWithTagsAndScores):
    class Meta:
        model = models.Event
        fields = [
            "id",
            "description",
            "tags",
            "activity",
            "scores",
            "created",
            "finished",
        ]

    created = TimestampField(required=False)
    finished = TimestampField(required=False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["activity_id"] = instance.activity.id
        return data

    def to_internal_value(self, data):
        activity_id = data.pop("activity_id", None)
        if activity_id is not None:
            data["activity"] = activity_id

        return super().to_internal_value(data)

    def create(self, validated_data):
        scores_data = validated_data.pop("scores")
        event = super().create(validated_data)
        for score_data in scores_data:
            score, created = models.Score.objects.get_or_create(**score_data)
            score.events.add(event)

        return event

    def update(self, instance, validated_data):
        scores_data = validated_data.pop("scores")
        event = super().update(instance, validated_data)
        event.scores.set([])
        for score_data in scores_data:
            score, created = models.Score.objects.get_or_create(**score_data)
            score.events.add(event)

        return event
