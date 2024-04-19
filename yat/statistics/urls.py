from django.urls import path

from statistics import views

app_name = "statistics"

urlpatterns = [
    path("wheel/", views.WheelView.as_view(), name="wheel"),
    path(
        "activity_duration/",
        views.ActivityDurationView.as_view(),
        name="activity_duration",
    ),
]
