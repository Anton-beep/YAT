import datetime

from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from homepage import serializers

__all__ = []


class UserContextViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self, *args, **kwargs):
        self.kwargs["id"] = self.request.data.get("id")
        return self.serializer_class.Meta.model.objects.filter(
            user=self.request.user,
        )

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = {"request": self.request}
        return super().get_serializer(*args, **kwargs)


class ActivityViewSet(UserContextViewSet):
    serializer_class = serializers.ActivitySerializer
    permission_classes = [IsAuthenticated]


class TagViewSet(UserContextViewSet):
    serializer_class = serializers.TagSerializer
    permission_classes = [IsAuthenticated]


def filter_by_field_timestamp(queryset, interval, name_field):
    if interval is not None:
        start = timezone.make_aware(
            datetime.datetime.fromtimestamp(int(interval[0])),
        )
        if len(interval) < 2:
            end = timezone.make_aware(datetime.datetime.now())
        else:
            end = timezone.make_aware(
                datetime.datetime.fromtimestamp(int(interval[1])),
            )

        return queryset.filter(
            **{
                f"{name_field}__gt": start,
                f"{name_field}__lt": end,
            },
        )

    return queryset


def filter_by_status(queryset, status):
    if status is not None:
        return queryset.filter(status=status)

    return queryset


def filter_by_tags(queryset, tags):
    if tags is not None:
        return queryset.filter(tags__in=tags)

    return queryset


class WithCreatedViewSet(UserContextViewSet):
    def get_queryset(self, *args, **kwargs):
        if self.request.method == "GET":
            return filter_by_field_timestamp(
                super().get_queryset(*args, **kwargs),
                self.request.data.get("created"),
                "created",
            )

        return super().get_queryset(*args, **kwargs)


class WithTagsViewSet(UserContextViewSet):
    def get_queryset(self, *args, **kwargs):
        if self.request.method == "GET":
            return filter_by_tags(
                super().get_queryset(*args, **kwargs),
                self.request.data.get("tags"),
            )

        return super().get_queryset(*args, **kwargs)


class NoteViewSet(WithCreatedViewSet):
    serializer_class = serializers.NoteSerializer
    permission_classes = [IsAuthenticated]


class FactorViewSet(UserContextViewSet):
    serializer_class = serializers.FactorSerializer
    permission_classes = [IsAuthenticated]


class TaskViewSet(WithCreatedViewSet, WithTagsViewSet):
    serializer_class = serializers.TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        if self.request.method == "GET":
            queryset = super().get_queryset(*args, **kwargs)
            queryset = filter_by_field_timestamp(
                queryset,
                self.request.data.get("deadline"),
                "deadline",
            )
            queryset = filter_by_status(
                queryset,
                self.request.data.get("status"),
            )
            return queryset

        return super().get_queryset(*args, **kwargs)


class EventViewSet(WithCreatedViewSet, WithTagsViewSet):
    serializer_class = serializers.EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        if self.request.method == "GET":
            return filter_by_field_timestamp(
                super().get_queryset(*args, **kwargs),
                self.request.data.get("finished"),
                "finished",
            )

        return super().get_queryset(*args, **kwargs)
