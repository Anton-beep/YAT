from django.contrib import admin
from django.urls import path
from django.urls.conf import include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/users/", include("users.urls"), name="users"),
    path("api/v1/homepage/", include("homepage.urls"), name="homepage"),
    path("api/v1/statistics/", include("stats.urls"), name="statistics"),
]
