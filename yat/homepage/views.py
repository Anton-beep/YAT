from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from homepage import models, serializers

__all__ = []


class UserContextViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self, *args, **kwargs):
        self.kwargs["id"] = self.request.data.get("id", None)
        return self.serializer_class.Meta.model.objects.filter(user=self.request.user)

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = {"request": self.request}
        return super().get_serializer(*args, **kwargs)


class ActivityViewSet(UserContextViewSet):
    serializer_class = serializers.ActivitySerializer
    permission_classes = [IsAuthenticated]


class TagViewSet(UserContextViewSet):
    serializer_class = serializers.TagSerializer
    permission_classes = [IsAuthenticated]
