from http import HTTPStatus

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from homepage import models

__all__ = []

User = get_user_model()


class EventTestCase(APITestCase):
    user = None
    client = None

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        # test user
        cls.client = APIClient()

        cls.user = User.objects.create_user(
            email="testTask@email.com",
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

        # test factors
        cls.factor1 = models.Factor.objects.create(
            user=cls.user,
            name="test_name1",
        )

        cls.factor2 = models.Factor.objects.create(
            user=cls.user,
            name="test_name2",
        )

        # test scores
        cls.score1 = models.Score.objects.create(
            factor=cls.factor1,
            value=10,
        )

        # test activity
        cls.activity1 = models.Activity.objects.create(
            user=cls.user,
            name="test_name1",
        )

        # test events
        cls.event = models.Event.objects.create(
            user=cls.user,
            description="test_description1",
            activity=cls.activity1,
        )
        cls.event.tags.set([cls.tag1])
        cls.event.scores.set([cls.score1])

    def test_event_get(self):
        event_count = models.Event.objects.count()
        response = self.client.get(
            reverse("homepage:events"),
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(event_count, len(response.data))

        self.assertEqual(
            response.data[0]["description"],
            self.event.description,
        )
        self.assertEqual(response.data[0]["tags"][0], self.tag1.id)
        self.assertEqual(response.data[0]["factors"][0]["id"], self.factor1.id)
        self.assertEqual(response.data[0]["activity_id"], self.activity1.id)

    def test_event_post(self):
        event_count = models.Event.objects.count()
        response = self.client.post(
            reverse("homepage:events"),
            {
                "description": "test_description2",
                "tags": [self.tag2.id],
                "factors": [{"id": self.factor2.id, "value": 20}],
                "activity_id": self.activity1.id,
                "created": "1712605504",
                "finished": "1712605504",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(event_count + 1, models.Event.objects.count())

        event = models.Event.objects.get(id=response.data["id"])
        self.assertEqual(event.description, "test_description2")
        self.assertEqual(event.tags.first().id, self.tag2.id)
        self.assertEqual(event.scores.first().factor.id, self.factor2.id)
        self.assertEqual(event.scores.first().value, 20)
        self.assertEqual(event.activity.id, self.activity1.id)

    def test_event_put(self):
        response = self.client.put(
            reverse("homepage:events"),
            {
                "id": self.event.id,
                "description": "test_description3",
                "tags": [self.tag2.id],
                "factors": [{"id": self.factor2.id, "value": 20}],
                "activity_id": self.activity1.id,
                "created": "1712605504",
                "finished": "1712605504",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)

        event = models.Event.objects.get(id=self.event.id)
        self.assertEqual(event.description, "test_description3")
        self.assertEqual(event.tags.first().id, self.tag2.id)
        self.assertEqual(event.scores.first().factor.id, self.factor2.id)
        self.assertEqual(event.scores.first().value, 20)
        self.assertEqual(event.activity.id, self.activity1.id)

    def test_event_delete(self):
        event_count = models.Event.objects.count()
        response = self.client.delete(
            reverse("homepage:events"),
            {"id": self.event.id},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(event_count - 1, models.Event.objects.count())
        self.assertFalse(
            models.Event.objects.filter(id=self.event.id).exists(),
        )
