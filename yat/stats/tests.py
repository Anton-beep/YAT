import datetime
import json

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from homepage import models

__all__ = []


User = get_user_model()


def normalize_timestamp(dt):
    return str(timezone.make_aware(dt).timestamp()).split(".")[0]


class WheelTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.client = APIClient()

        cls.user = User.objects.create_user(
            email="testUserWheel@mail.com",
            password="testUserWheelPassword",
            first_name="Test",
            last_name="Homepage",
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

        cls.tag3 = models.Tag.objects.create(
            user=cls.user,
            name="test_name3",
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
            value=3,
        )

        cls.score2 = models.Score.objects.create(
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

        cls.event2 = models.Event.objects.create(
            user=cls.user,
            description="test_description2",
            activity=cls.activity1,
        )
        cls.event2.tags.set([cls.tag2])
        cls.event2.scores.set([cls.score2])

        cls.event3 = models.Event.objects.create(
            user=cls.user,
            description="test_description3",
            activity=cls.activity1,
            finished=timezone.make_aware(
                datetime.datetime(2022, 1, 1, 1, 0, 0),
            ),
        )
        cls.event3.tags.set([cls.tag1])
        cls.event3.scores.set([cls.score1])
        cls.event3.created = timezone.make_aware(
            datetime.datetime(2021, 1, 1, 0, 0, 0),
        )
        cls.event3.save()

    def test_wheel_get_average(self):
        response = self.client.get(
            reverse("statistics:wheel"),
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["factors"]), 1)
        self.assertEqual(
            round(response.data["factors"][0][self.factor1.id], 2),
            5.33,
        )

    def test_wheel_get_average_with_created(self):
        data = json.dumps(
            {
                "created": [
                    normalize_timestamp(
                        datetime.datetime(2010, 1, 1, 0, 0, 0),
                    ),
                    normalize_timestamp(
                        datetime.datetime(2011, 1, 1, 0, 0, 0),
                    ),
                ],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:wheel"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            round(response.data["factors"][0][self.factor1.id], 2),
            5.33,
        )

        data = json.dumps(
            {
                "created": [
                    normalize_timestamp(
                        datetime.datetime(2020, 1, 1, 0, 0, 0),
                    ),
                    normalize_timestamp(
                        datetime.datetime(2022, 1, 1, 0, 0, 0),
                    ),
                ],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:wheel"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            round(response.data["factors"][0][self.factor1.id], 2),
            5.33,
        )

    def test_wheel_get_average_with_finished(self):
        data = json.dumps(
            {
                "finished": [
                    normalize_timestamp(
                        datetime.datetime(2010, 1, 1, 0, 0, 0),
                    ),
                    normalize_timestamp(
                        datetime.datetime(2011, 1, 1, 0, 0, 0),
                    ),
                ],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:wheel"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            round(response.data["factors"][0][self.factor1.id], 2),
            5.33,
        )

        data = json.dumps(
            {
                "finished": [
                    normalize_timestamp(
                        datetime.datetime(2021, 1, 1, 0, 0, 0),
                    ),
                    normalize_timestamp(
                        datetime.datetime(2023, 1, 1, 0, 0, 0),
                    ),
                ],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:wheel"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            round(response.data["factors"][0][self.factor1.id], 2),
            5.33,
        )

    def test_wheel_get_tags(self):
        data = json.dumps(
            {
                "tags": [self.tag3.id],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:wheel"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [round(x, 2) for x in response.data["factors"][0].values()],
            [5.33],
        )

        data = json.dumps(
            {
                "tags": [self.tag1.id],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:wheel"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        try:
            self.assertEqual(
                round(response.data["factors"][0][self.factor1.id], 2),
                5.33,
            )
        except KeyError:
            self.assertEqual(response.data["factors"][1][self.factor1.id], 3)


class PercentageActivitiesTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.client = APIClient()

        cls.user = User.objects.create_user(
            email="testUserWheel@mail.com",
            password="testUserWheelPassword",
            first_name="Test",
            last_name="Homepage",
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

        cls.tag3 = models.Tag.objects.create(
            user=cls.user,
            name="test_name3",
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
            value=3,
        )

        cls.score2 = models.Score.objects.create(
            factor=cls.factor1,
            value=10,
        )

        # test activity
        cls.activity1 = models.Activity.objects.create(
            user=cls.user,
            name="test_name1",
        )

        cls.activity2 = models.Activity.objects.create(
            user=cls.user,
            name="test_name1",
        )

        cls.activity3 = models.Activity.objects.create(
            user=cls.user,
            name="test_name1",
        )

        # test events
        cls.event = models.Event.objects.create(
            user=cls.user,
            description="test_description1",
            activity=cls.activity1,
            finished=timezone.make_aware(
                datetime.datetime(2022, 1, 1, 1, 0, 0),
            ),
        )
        cls.event.tags.set([cls.tag1])
        cls.event.scores.set([cls.score1])
        cls.event.created = timezone.make_aware(
            datetime.datetime(2021, 1, 1, 0, 0, 0),
        )
        cls.event.save()

        cls.event2 = models.Event.objects.create(
            user=cls.user,
            description="test_description2",
            activity=cls.activity2,
            finished=timezone.make_aware(
                datetime.datetime(2022, 1, 1, 1, 0, 0),
            ),
        )
        cls.event2.tags.set([cls.tag2])
        cls.event2.scores.set([cls.score2])
        cls.event2.created = timezone.make_aware(
            datetime.datetime(2021, 1, 1, 0, 0, 0),
        )
        cls.event2.save()

        cls.event3 = models.Event.objects.create(
            user=cls.user,
            description="test_description3",
            activity=cls.activity3,
            finished=timezone.make_aware(
                datetime.datetime(2022, 1, 1, 1, 0, 0),
            ),
        )
        cls.event3.tags.set([cls.tag1])
        cls.event3.scores.set([cls.score1])
        cls.event3.created = timezone.make_aware(
            datetime.datetime(2021, 1, 1, 0, 0, 0),
        )
        cls.event3.save()

    def test_activity_duration_get_percentage(self):
        response = self.client.generic(
            path=reverse("statistics:activity_duration"),
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            round(response.data["activity"][0]["percentage"], 2),
            33.33,
        )

    def test_activity_duration_get_percentage_with_created(self):
        data = json.dumps(
            {
                "created": [
                    normalize_timestamp(
                        datetime.datetime(2010, 1, 1, 0, 0, 0),
                    ),
                    normalize_timestamp(
                        datetime.datetime(2011, 1, 1, 0, 0, 0),
                    ),
                ],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:activity_duration"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["activity"], [])

    def test_activity_duration_get_percentage_with_tags(self):
        data = json.dumps(
            {
                "tags": [self.tag3.id],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:activity_duration"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["activity"], [])

        data = json.dumps(
            {
                "tags": [self.tag1.id],
            },
        )

        response = self.client.generic(
            path=reverse("statistics:activity_duration"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["activity"][0]["percentage"], 50)
        self.assertEqual(response.data["activity"][1]["percentage"], 50)
