from django.urls import path
from homepage import views

urlpatterns = [
    path(
        "activities/",
        views.ActivityAPIView.as_view(),
        name="activities"
    ),
    path(
        "activities/<int:pk>/",
        views.ActivityAPIView.as_view(),
        name="put_activities"
    ),
]
