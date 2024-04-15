from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpRequest
from homepage import serializers, models


class ActivityAPIView(APIView):

    def get(self, request: HttpRequest):
        activities = serializers.ActivitySerializer(
            models.Activity.objects.all(),
            many=True,
        )
        return Response(activities.data)

    def post(self, request: HttpRequest):
        serializer = serializers.ActivitySerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: HttpRequest, *args, **kwargs):
        pk = kwargs.get("pk", None)

        if pk is None:
            return Response(
                {"error": "Method PUT not allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            activity = models.Activity.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(
                {"error": "Objects does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = serializers.ActivitySerializer(
            data=request.data,
            instance=activity
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: HttpRequest, *args, **kwargs):
        pk = kwargs.get("pk", None)

        if pk is None:
            return Response(
                {"error": "Method DELETE not allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            activity = models.Activity.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(
                {"error": "Objects does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        activity.delete()
        return Response(status=status.HTTP_200_OK)



