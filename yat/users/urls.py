from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import (
    ConfirmEmailView,
    CustomTokenObtainPairView,
    RegisterUserView,
    SecretView,
)

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path(
        "login/",
        CustomTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "confirm-email/<uuid:token>/",
        ConfirmEmailView.as_view(),
        name="confirm",
    ),
    path("secret/", SecretView.as_view(), name="secret"),
]
