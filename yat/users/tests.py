from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.views import status

__all__ = []

User = get_user_model()


class BaseViewTest(TestCase):
    client = APIClient()

    @staticmethod
    def create_test_user():
        email = "testuser@example.com"
        password = "testpassword"
        first_name = "Test"
        last_name = "User"
        if not User.objects.filter(email=email).exists():
            User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                is_active=True,
            )

    def setUp(self):
        self.create_test_user()


class TestUserRegistration(BaseViewTest):

    def test_register_user(self):
        response = self.client.post(
            reverse("register"),
            data={
                "email": "newuser@example.com",
                "password": "newpassword",
                "first_name": "New",
                "last_name": "User",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TestUserLogin(BaseViewTest):

    def test_login_user(self):
        response = self.client.post(
            reverse("token_obtain_pair"),
            data={"email": "testuser@example.com", "password": "testpassword"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)


class TestConfirmation(BaseViewTest):

    def test_confirm_email(self):
        response = self.client.post(
            reverse("register"),
            data={
                "email": "newusernotactive@example.com",
                "password": "newpassword",
                "first_name": "New",
                "last_name": "User",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email="newusernotactive@example.com")
        self.assertEqual(user.is_active, False)

        response = self.client.get(
            reverse(
                "confirm",
                kwargs={
                    "token": settings.FERNET_CRYPT_EMAIL.encrypt(
                        user.email.encode(),
                    ).decode(),
                },
            ),
        )
        user.refresh_from_db()

        self.assertEqual(user.is_active, True)
