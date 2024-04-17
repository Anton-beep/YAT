from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from homepage import models, serializers

__all__ = []


class UserContextViewSet(ModelViewSet):
    model = None
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self, *args, **kwargs):
        self.kwargs.update(self.request.data)
        return self.model.objects.filter(user=self.request.user)

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = {"request": self.request}
        return super().get_serializer(*args, **kwargs)


class ActivityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            activity = models.Activity.objects.get(id=request.data["id"])
            activity.delete()
            return Response(status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        activities = serializers.ActivitySerializer(
            models.Activity.objects.all(),
            many=True,
        )
        return Response(activities.data)

    def post(self, request):
        serializer = serializers.ActivitySerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, *args, **kwargs):
        serializer = serializers.ActivitySerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TagViewSet(UserContextViewSet):
    serializer_class = serializers.TagSerializer
    permission_classes = [IsAuthenticated]
    model = models.Tag
    lookup_field = "id"
