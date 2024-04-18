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


class NoteViewSet(UserContextViewSet):
    serializer_class = serializers.NoteSerializer
    permission_classes = [IsAuthenticated]


class FactorViewSet(UserContextViewSet):
    serializer_class = serializers.FactorSerializer
    permission_classes = [IsAuthenticated]


class TaskViewSet(UserContextViewSet):
    serializer_class = serializers.TaskSerializer
    permission_classes = [IsAuthenticated]
