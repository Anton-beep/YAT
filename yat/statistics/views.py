import datetime

from django.db.models import (
    Count,
    DateTimeField,
    ExpressionWrapper,
    F,
    FloatField,
    Q,
    Sum,
)
from django.db.models.functions import Cast
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

import homepage.serializers

__all__ = []


def normalize_interval(interval):
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

        return start, end

    raise ValueError("Interval is None, looks like we make a mistake")


def calculate_average_for_factors(queryset, request):
    filtrer_tasks = {}
    filter_events = {}

    finished = request.data.get("finished")
    if finished is not None:
        finished_interval = normalize_interval(finished)
        filtrer_tasks["scores__tasks__done__gt"] = finished_interval[0]
        filtrer_tasks["scores__tasks__done__lt"] = finished_interval[1]
        filter_events["scores__events__finished__gt"] = finished_interval[0]
        filter_events["scores__events__finished__lt"] = finished_interval[1]

    created = request.data.get("created")
    if created is not None:
        created_interval = normalize_interval(created)
        filtrer_tasks["scores__tasks__created__gt"] = created_interval[0]
        filtrer_tasks["scores__tasks__created__lt"] = created_interval[1]
        filter_events["scores__events__created__gt"] = created_interval[0]
        filter_events["scores__events__created__lt"] = created_interval[1]

    tags = request.data.get("tags")
    if tags is not None:
        filtrer_tasks["scores__tasks__tags__id__in"] = tags
        filter_events["scores__events__tags__id__in"] = tags

    # Apply the filters to the queryset

    # Annotate each factor with the sum of scores from related tasks and events
    factors = queryset.annotate(
        total_sum_score=Sum(
            "scores__value",
            filter=(Q(**filtrer_tasks) | Q(**filter_events)),
        ),
    )

    # Annotate each factor with the count of scores
    factors = factors.annotate(
        count_scores=Count("scores__tasks", filter=Q(**filtrer_tasks))
        + Count("scores__events", filter=Q(**filter_events)),
    )

    # Annotate each factor with the average of the sum of scores
    return factors.annotate(
        average_sum_score=ExpressionWrapper(
            Cast(F("total_sum_score"), FloatField()) / F("count_scores"),
            output_field=FloatField(),
        ),
    )


class WheelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = calculate_average_for_factors(
            homepage.models.Factor.objects.filter(user=request.user),
            request,
        )
        res = {"factors": []}
        for factor in queryset:
            res["factors"].append({factor.id: factor.average_sum_score})

        return Response(res, status=status.HTTP_200_OK)


def calculate_percentage_of_activities(request):
    filter_events = {}

    finished = request.data.get("finished")
    if finished is not None:
        finished_interval = normalize_interval(finished)
        filter_events["finished__gt"] = finished_interval[0]
        filter_events["finished__lt"] = finished_interval[1]

    created = request.data.get("created")
    if created is not None:
        created_interval = normalize_interval(created)
        filter_events["created__gt"] = created_interval[0]
        filter_events["created__lt"] = created_interval[1]

    tags = request.data.get("tags")
    if tags is not None:
        filter_events["tags__id__in"] = tags

    total_duration = homepage.models.Event.objects.filter(
        user=request.user,
        **filter_events,
    )
    total_duration = total_duration.annotate(
        duration=F("finished") - F("created"),
    ).aggregate(total_duration=Sum("duration"))["total_duration"]

    if total_duration is None:
        total_duration = datetime.timedelta(seconds=0)

    total_duration = float(total_duration.total_seconds())

    # Calculate duration of each activity
    activities = homepage.models.Activity.objects.filter(
        user=request.user,
        events__in=homepage.models.Event.objects.filter(**filter_events),
    ).annotate(
        duration=Sum(
            ExpressionWrapper(
                F("events__finished") - F("events__created"),
                output_field=DateTimeField(),
            ),
        ),
    )

    return activities, total_duration


class ActivityDurationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        activities, total_duration = calculate_percentage_of_activities(
            request,
        )
        res = {"activity": []}
        for activity in activities:
            if total_duration == 0:
                percentage = 0
            else:
                percentage = (
                    float(activity.duration.total_seconds()) / total_duration
                ) * 100

            res["activity"].append(
                {"id": activity.id, "percentage": percentage},
            )

        return Response(
            res,
            status=status.HTTP_200_OK,
        )
