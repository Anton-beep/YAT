from http import HTTPStatus

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from homepage import models


__all__ = []


User = get_user_model()


class TagTestCase(APITestCase):
    user = None
    client = None

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        # test user
        cls.client = APIClient()

        cls.user = User.objects.create_user(
            email="testTag@email.com",
            password="testTagPassword",
            first_name="Test",
            last_name="Tag",
            is_active=True,
        )

        cls.user.save()

        cls.token = str(AccessToken.for_user(cls.user))

        # test tags
        cls.tag1 = models.Tag.objects.create(
            user=cls.user,
            name="test_name1",
        )

        cls.tag2 = models.Tag.objects.create(
            user=cls.user,
            name="test_name2",
        )

    def test_tag_get(self):
        tag_count = models.Tag.objects.count()
        response = self.client.get(
            reverse("homepage:tags"),
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(tag_count, len(response.data["tags"]))

    def test_tag_post(self):
        tag_count = models.Tag.objects.count()
        response = self.client.post(
            reverse("homepage:tags"),
            data={"name": "test_name_new"},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(tag_count + 1, models.Tag.objects.count())

    def test_tag_put(self):
        response = self.client.put(
            reverse("homepage:tags"),
            data={"id": self.tag1.id, "name": "test_name_new"},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.tag1.refresh_from_db()
        self.assertEqual(self.tag1.name, "test_name_new")

    def test_tag_delete(self):
        tag_count = models.Tag.objects.count()
        response = self.client.delete(
            reverse("homepage:tags"),
            data={"id": self.tag1.id},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(models.Tag.objects.count(), tag_count - 1)

    def test_tag_put_not_found(self):
        response = self.client.put(
            reverse("homepage:tags"),
            data={"name": "test_name_new"},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)
