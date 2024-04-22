from http import HTTPStatus

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from homepage import models


__all__ = []


User = get_user_model()


class FactorTestCase(APITestCase):
    user = None
    client = None

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        # test user
        cls.client = APIClient()

        cls.user = User.objects.create_user(
            email="testFactor@email.com",
            password="testFactorPassword",
            first_name="Test",
            last_name="Factor",
            is_active=True,
        )

        cls.user.save()

        cls.token = str(AccessToken.for_user(cls.user))

        # test factors
        cls.factor1 = models.Factor.objects.create(
            user=cls.user,
            name="test_name1",
            visible=True,
        )

        cls.factor2 = models.Factor.objects.create(
            user=cls.user,
            name="test_name2",
            visible=True,
        )

    def test_factor_get(self):
        factor_count = models.Factor.objects.count()
        response = self.client.get(
            reverse("homepage:factors"),
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(factor_count, len(response.data["factors"]))

    def test_factor_post(self):
        factor_count = models.Factor.objects.count()
        response = self.client.post(
            reverse("homepage:factors"),
            data={
                "name": "test_name_new",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(factor_count + 1, models.Factor.objects.count())

    def test_factor_put(self):
        response = self.client.put(
            reverse("homepage:factors"),
            data={
                "id": self.factor1.id,
                "name": "test_name_new",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.factor1.refresh_from_db()
        self.assertEqual(self.factor1.name, "test_name_new")

    def test_factor_delete(self):
        response = self.client.delete(
            reverse("homepage:factors"),
            data={"id": self.factor1.id},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.factor1.refresh_from_db()
        self.assertFalse(self.factor1.visible)

    def test_factor_put_not_found(self):
        response = self.client.put(
            reverse("homepage:factors"),
            data={
                "name": "test_name_new",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)
