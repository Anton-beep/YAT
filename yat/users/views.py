from uuid import uuid4

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
            token = uuid4()
            user.activation_token = token
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
    def get(self, request, token):
        try:
            user = User.objects.get(activation_token=token)
        except User.DoesNotExist:
            return Response(
                {"message": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.is_active:
            return HttpResponse(
                "Почта уже подтверждена. Вы можете закрыть эту страницу",
                status=status.HTTP_200_OK,
            )

        user.is_active = True
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
