import datetime

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
        fields = ["id", "name", "icon", "icon_name", "icon_color", "visible"]

    icon = serializers.SerializerMethodField(required=False)
    name = serializers.CharField(required=False)
    icon_name = serializers.CharField(required=False)
    icon_color = serializers.CharField(required=False)

    @staticmethod
    def get_icon(obj):
        return {
            "name": obj.icon_name,
            "color": obj.icon_color,
        }

    def get_fields(self):
        fields = super().get_fields()
        request_method = self.context["request"].method
        if request_method == "POST":
            fields["name"].required = True
            fields["icon"].required = True

        return fields

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
        instance.name = validated_data.pop(
            "name",
            instance.name,
        )
        instance.icon_name = validated_data.pop(
            "icon_name",
            instance.icon_name,
        )
        instance.icon_color = validated_data.pop(
            "icon_color",
            instance.icon_color,
        )
        return super().update(instance, validated_data)


class TagSerializer(UserContextSerializer):
    class Meta:
        model = models.Tag
        fields = ["id", "name", "visible"]


class FactorSerializer(UserContextSerializer):
    class Meta:
        model = models.Factor
        fields = ["id", "name", "visible"]


class SerializerWithTagsAndScores(UserContextSerializer):
    class Meta:
        fields = []

    tags = serializers.PrimaryKeyRelatedField(
        queryset=models.Tag.objects.all(),
        many=True,
        required=False,
    )
    description = serializers.CharField(required=False, allow_blank=True)

    def __init__(self, *args, **kwargs):
        assert "tags" in self.Meta.fields, "tags field is required"
        assert "scores" in self.Meta.fields, "scores field is required"
        super().__init__(*args, **kwargs)

    def to_internal_value(self, data):
        factors = data.pop("factors", [])
        data["scores"] = []
        for el in factors:
            el_factor = models.Factor.objects.get(id=el["id"])
            score, _ = models.Score.objects.get_or_create(
                factor=el_factor,
                value=el["value"],
            )
            data["scores"].append(score.id)

        return super().to_internal_value(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["factors"] = [
            {"id": score.factor.id, "value": score.value}
            for score in instance.scores.all()
        ]
        del data["scores"]
        return data


class NoteSerializer(UserContextSerializer):
    class Meta:
        model = models.Note
        fields = ["id", "name", "description", "tags"]

    description = serializers.CharField(required=False, allow_blank=True)
    tags = serializers.PrimaryKeyRelatedField(
        queryset=models.Tag.objects.all(),
        many=True,
        required=False,
    )


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
    description = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        scores = validated_data.pop("scores")
        task = super().create(validated_data)
        created = validated_data.get("created")
        if created:
            task.created = created
            task.save()

        if scores:
            for score in scores:
                exist_score = models.Score.objects.get(id=score.id)
                task.scores.add(exist_score)

        return task

    def update(self, instance, validated_data):
        scores = validated_data.pop("scores")
        task = super().update(instance, validated_data)
        task.scores.set([])
        for score in scores:
            exist_score = models.Score.objects.get(id=score.id)
            exist_score.tasks.add(task)

        return task

    def validate(self, data):
        if data.get("status") != "done" and (
            "scores" in data and data["scores"]
        ):
            raise serializers.ValidationError(
                {"factors": 'Factors can only be sent if status is "done".'},
            )

        return data


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
    description = serializers.CharField(required=False, allow_blank=True)
    activity = serializers.PrimaryKeyRelatedField(
        queryset=models.Activity.objects.all(),
        required=False,
    )

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
        scores = validated_data.pop("scores")
        event = super().create(validated_data)
        created = validated_data.get("created")
        if created:
            event.created = created
            event.save()

        if scores:
            for score in scores:
                exist_score = models.Score.objects.get(id=score.id)
                exist_score.events.add(event)

        return event

    def update(self, instance, validated_data):
        scores = validated_data.pop("scores")
        event = super().update(instance, validated_data)
        event.scores.set([])
        for score in scores:
            exist_score = models.Score.objects.get(id=score.id)
            exist_score.events.add(event)

        return event

    def validate(self, data):
        created = data.get("created")
        finished = data.get("finished")

        if (
            isinstance(created, datetime.datetime)
            and isinstance(finished, datetime.datetime)
            and created > finished
        ):
            raise serializers.ValidationError(
                {
                    "created": "Created timestamp cannot be greater than"
                    " finished timestamp.",
                },
            )

        if not finished and ("scores" in data and data["scores"]):
            raise serializers.ValidationError(
                {"factors": "Factors can only be sent if event is finished."},
            )

        return data
