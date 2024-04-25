from uuid import uuid4

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.http import HttpResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from users.serializers import UserSerializer, ChangeUserSerializer

__all__ = []

User = get_user_model()


class RegisterUserView(APIView):
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = uuid4()
            user.activation_token = token
            confirm_url = settings.REACT_APP_URL + f"/confirm/{token}"
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
    def post(self, request, token, new_email=None):
        try:
            user = User.objects.get(activation_token=token)
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
        user.activation_token = uuid4()
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
        serializer = ChangeUserSerializer(
            user, data=request.data, partial=True
        )
        if serializer.is_valid():
            if (
                "email" in serializer.validated_data
                and serializer.validated_data["email"] != user.email
            ):
                token = uuid4()
                user.activation_token = token
                new_email = settings.FERNET_CRYPT_EMAIL.encrypt(
                    serializer.validated_data["email"].encode(),
                ).decode()
                confirm_url = (
                    settings.REACT_APP_URL + f"/confirm/{token}/{new_email}"
                )
                send_mail(
                    "Confirm your new email",
                    f"Чтобы подтвердить новую почту, "
                    f"перейдите по ссылке: {confirm_url}",
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


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            token = uuid4()
            user.activation_token = token
            confirm_url = settings.REACT_APP_URL + f"/restoration/{token}"
            send_mail(
                "Восстановление пароля",
                f"Чтобы восстановить пароль, "
                f"пожалуйста перейдите по ссылке: {confirm_url}",
                "yat@bibbob.com",
                [user.email],
                fail_silently=False,
            )
            user.save()

        return Response(
            {"message": "ok"},
            status=status.HTTP_200_OK,
        )


class RestorationView(APIView):
    def post(self, request):
        token = request.data.get("token")
        user = User.objects.filter(activation_token=token).first()
        if not user:
            return Response(
                {"message": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        password = request.data.get("password")
        if not password:
            return Response(
                {"message": "Password is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(password)
        user.activation_token = uuid4()
        user.save()
        return Response(
            {"message": "Password restored"},
            status=status.HTTP_200_OK,
        )


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
