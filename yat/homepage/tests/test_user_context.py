from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from homepage import models

__all__ = []

User = get_user_model()


class TestUserContext(TestCase):
    user = None
    client = None

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        # test user
        cls.client = APIClient()

        cls.user1 = User.objects.create_user(
            email="testUserCon@email.com",
            password="testUserConPassword",
            first_name="Test",
            last_name="UserCon",
            is_active=True,
        )

        cls.user2 = User.objects.create_user(
            email="testUserCon2@email.com",
            password="testUserConPassword",
            first_name="Test",
            last_name="UserCon",
            is_active=True,
        )

        cls.token1 = str(AccessToken.for_user(cls.user1))

        cls.token2 = str(AccessToken.for_user(cls.user2))

        cls.user1_note = models.Note.objects.create(
            user=cls.user1,
            name="test_title1",
            description="test_content1",
        )

        cls.user2_note = models.Note.objects.create(
            user=cls.user2,
            name="test_title2",
            description="test_content2",
        )

    def test_user_get(self):
        response1 = self.client.get(
            reverse("homepage:notes"),
            HTTP_AUTHORIZATION=f"Bearer {self.token1}",
        )
        self.assertEqual(response1.status_code, 200)

        response2 = self.client.get(
            reverse("homepage:notes"),
            HTTP_AUTHORIZATION=f"Bearer {self.token2}",
        )
        self.assertEqual(response2.status_code, 200)

        self.assertEqual(len(response1.data), 1)
        self.assertEqual(len(response2.data), 1)

        self.assertEqual(response1.data[0]["notes"]["name"], self.user1_note.name)
        self.assertEqual(response2.data[0]["notes"]["name"], self.user2_note.name)

    def test_user_post(self):
        response1 = self.client.post(
            reverse("homepage:notes"),
            {
                "name": "test_title3",
                "description": "test_content3",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token1}",
        )
        self.assertEqual(response1.status_code, 201)

        response1_get = self.client.get(
            reverse("homepage:notes"),
            HTTP_AUTHORIZATION=f"Bearer {self.token1}",
        )
        self.assertEqual(len(response1_get.data), 2)
        self.assertEqual(response1_get.data[1]["notes"]["name"], "test_title3")

        response2_get = self.client.get(
            reverse("homepage:notes"),
            HTTP_AUTHORIZATION=f"Bearer {self.token2}",
        )
        self.assertEqual(len(response2_get.data), 1)
        self.assertEqual(response2_get.data[0]["notes"]["name"], self.user2_note.name)

    def test_user_put_not_owned(self):
        # user1 tries to update user2's note
        response1 = self.client.put(
            reverse("homepage:notes"),
            {
                "id": self.user2_note.id,
                "name": "test_title3",
                "description": "test_content3",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token1}",
        )
        self.assertEqual(response1.status_code, 415)
