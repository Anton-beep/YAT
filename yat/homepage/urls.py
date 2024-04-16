from django.urls import path

from homepage import views

app_name = "homepage"

urlpatterns = [
    path("activities/", views.ActivityAPIView.as_view(), name="activities"),
]
