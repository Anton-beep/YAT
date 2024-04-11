from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.http import HttpResponse
from django.urls import reverse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from users.serializers import UserSerializer

__all__ = []

User = get_user_model()


class RegisterUserView(APIView):
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = settings.FERNET_CRYPT_EMAIL.encrypt(
                user.email.encode(),
            ).decode()
            confirm_url = request.build_absolute_uri(
                reverse("confirm", kwargs={"token": token}),
            )
            send_mail(
                "Подтверждение почты",
                f"Для подтверждения перейдите по ссылке: {confirm_url}",
                "yat@bibbob.com",
                [user.email],
                fail_silently=False,
            )
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmEmailView(APIView):
    def get(self, request, token, new_email=None):
        try:
            email = settings.FERNET_CRYPT_EMAIL.decrypt(
                token.encode(),
            ).decode()
            user = User.objects.get(email=email)
            if new_email:
                user.email = settings.FERNET_CRYPT_EMAIL.decrypt(
                    new_email,
                ).decode()
        except User.DoesNotExist:
            return Response(
                {"message": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = True
        user.activation_token = ""
        user.save()
        return HttpResponse(
            "Почта подтверждена. Вы можете закрыть эту страницу",
            status=status.HTTP_200_OK,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class SecretView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "message": "This is a secret message for"
                " authenticated users only.",
            },
        )


class ChangeUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if (
                "email" in serializer.validated_data
                and serializer.validated_data["email"] != user.email
            ):
                token = settings.FERNET_CRYPT_EMAIL.encrypt(
                    user.email.encode(),
                ).decode()
                user.activation_token = token
                confirm_url = request.build_absolute_uri(
                    reverse(
                        "confirm",
                        kwargs={
                            "token": token,
                            "new_email": settings.FERNET_CRYPT_EMAIL.encrypt(
                                serializer.validated_data["email"].encode(),
                            ).decode(),
                        },
                    ),
                )
                send_mail(
                    "Confirm your new email",
                    f"To confirm your new email, "
                    f"please go to the following link: {confirm_url}",
                    "yat@bibbob.com",
                    [serializer.validated_data["email"]],
                    fail_silently=False,
                )
                serializer.validated_data["email"] = user.email

            user.set_password(
                serializer.validated_data.pop("password", user.password),
            )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
