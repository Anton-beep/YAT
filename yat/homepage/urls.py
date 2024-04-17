from django.urls import path

from homepage import views

app_name = "homepage"

urlpatterns = [
    # path("activities/", views.ActivityAPIView.as_view(), name="activities"),
    path(
        "activities/",
        views.ActivityViewSet.as_view(
            {
                "get": "list",
                "post": "create",
                "put": "update",
                "delete": "destroy",
            },
        ),
        name="activities",
    ),
    path(
        "tags/",
        views.TagViewSet.as_view(
            {
                "get": "list",
                "post": "create",
                "put": "update",
                "delete": "destroy",
            },
        ),
        name="tags",
    ),
]
