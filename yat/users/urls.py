from django.urls import path
from users.views import (
    RegisterUserView,
    CustomTokenObtainPairView,
    secret_view,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path(
        "login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("secret/", secret_view, name="secret"),
]
