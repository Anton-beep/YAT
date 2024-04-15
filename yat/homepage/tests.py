from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from homepage import models
from http import HTTPStatus

User = get_user_model()


class ActivityTestCase(APITestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.data = {
            "user": 1,
            "name": "test_name",
            "icon_name": "test",
            "icon_color": "test"
        }
        User.objects.create(email="test@gmail.com")

    def test_activity_get(self):
        response = self.client.get(reverse("activities"))
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_activity_post(self):
        activity_count = models.Activity.objects.count()
        response = self.client.post(
            reverse("activities"),
            data=self.data
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(activity_count + 1, models.Activity.objects.count())



