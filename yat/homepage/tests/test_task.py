import datetime
from http import HTTPStatus

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from homepage import models

__all__ = []

User = get_user_model()


class TaskTestCase(APITestCase):
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

        # test tasks
        cls.task1 = models.Task.objects.create(
            user=cls.user,
            name="test_name1",
            description="test_description1",
            status=models.Task.Statuses.NOT_DONE,
            deadline=timezone.now(),
        )
        cls.task1.tags.add(cls.tag1)
        cls.task1.scores.add(cls.score1)

    def test_task_get(self):
        task_count = models.Task.objects.count()
        response = self.client.get(
            reverse("homepage:tasks"),
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(task_count, len(response.data))

    def test_task_post(self):
        task_count = models.Task.objects.count()
        time_now = datetime.datetime.now().replace(microsecond=0)
        response = self.client.post(
            reverse("homepage:tasks"),
            data={
                "name": "test_name_new",
                "description": "test_description_new",
                "status": "not done",
                "tags": [self.tag1.id],
                "factors": [
                    {
                        "id": self.factor1.id,
                        "value": 10,
                    },
                    {
                        "id": self.factor2.id,
                        "value": 0,
                    },
                ],
                "deadline": str(time_now.timestamp()).split(".")[0],
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(task_count + 1, models.Task.objects.count())
        created_task = models.Task.objects.get(id=response.data["id"])
        # check all fields
        self.assertEqual(created_task.name, "test_name_new")
        self.assertEqual(created_task.description, "test_description_new")
        self.assertEqual(created_task.status, models.Task.Statuses.NOT_DONE)
        self.assertEqual(created_task.deadline, timezone.make_aware(time_now))
        self.assertEqual(created_task.tags.first().id, self.tag1.id)
        self.assertEqual(
            created_task.scores.first().factor.id, self.factor1.id,
        )

    def test_task_put(self):
        time_now = datetime.datetime.now().replace(microsecond=0)
        new_time = time_now + datetime.timedelta(days=1)
        response = self.client.put(
            reverse("homepage:tasks"),
            data={
                "id": self.task1.id,
                "name": "test_name_new",
                "description": "test_description_new",
                "status": "not done",
                "tags": [self.tag2.id],
                "factors": [
                    {
                        "id": self.factor1.id,
                        "value": -1,
                    },
                    {
                        "id": self.factor2.id,
                        "value": -1,
                    },
                ],
                "deadline": str(new_time.timestamp()).split(".")[0],
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.task1.refresh_from_db()
        # check all fields
        self.assertEqual(self.task1.name, "test_name_new")
        self.assertEqual(self.task1.description, "test_description_new")
        self.assertEqual(self.task1.status, models.Task.Statuses.NOT_DONE)
        self.assertEqual(self.task1.deadline, timezone.make_aware(new_time))
        self.assertEqual(self.task1.tags.first().id, self.tag2.id)
        self.assertEqual(self.task1.scores.first().value, -1)

    def test_task_delete(self):
        task_count = models.Task.objects.count()
        response = self.client.delete(
            reverse("homepage:tasks"),
            data={"id": self.task1.id},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(models.Task.objects.count(), task_count - 1)

    def test_task_put_not_found(self):
        response = self.client.put(
            reverse("homepage:tasks"),
            data={"name": "test_name_new"},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)
