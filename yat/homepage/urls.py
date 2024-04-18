from django.urls import path

from homepage import views

app_name = "homepage"

urlpatterns = [
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
    path(
        "notes/",
        views.NoteViewSet.as_view(
            {
                "get": "list",
                "post": "create",
                "put": "update",
                "delete": "destroy",
            },
        ),
        name="notes",
    ),
    path(
        "factors/",
        views.FactorViewSet.as_view(
            {
                "get": "list",
                "post": "create",
                "put": "update",
                "delete": "destroy",
            },
        ),
        name="factors",
    ),
    path(
        "tasks/",
        views.TaskViewSet.as_view(
            {
                "get": "list",
                "post": "create",
                "put": "update",
                "delete": "destroy",
            },
        ),
        name="tasks",
    ),
    path(
        "events/",
        views.EventViewSet.as_view(
            {
                "get": "list",
                "post": "create",
                "put": "update",
                "delete": "destroy",
            },
        ),
        name="events",
    )
]
