import datetime
from http import HTTPStatus
import json
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from homepage import models

__all__ = []

User = get_user_model()


class NoteTestCase(APITestCase):
    user = None
    client = None

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        # test user
        cls.client = APIClient()

        cls.user = User.objects.create_user(
            email="testNote@email.com",
            password="testNotePassword",
            first_name="Test",
            last_name="Note",
            is_active=True,
        )

        cls.user.save()

        cls.token = str(AccessToken.for_user(cls.user))

        # test notes
        cls.note1 = models.Note.objects.create(
            user=cls.user,
            name="test_name1",
            description="test_description",
        )

        cls.note2 = models.Note.objects.create(
            user=cls.user,
            name="test_name2",
            description="test_description",
        )

    def test_note_get(self):
        note_count = models.Note.objects.count()
        response = self.client.get(
            reverse("homepage:notes"),
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(note_count, len(response.data))

    def test_note_post(self):
        note_count = models.Note.objects.count()
        response = self.client.post(
            reverse("homepage:notes"),
            data={
                "name": "test_name_new",
                "description": "new",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(note_count + 1, models.Note.objects.count())

    def test_note_put(self):
        response = self.client.put(
            reverse("homepage:notes"),
            data={
                "id": self.note1.id,
                "name": "test_name_new",
                "description": "new",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.note1.refresh_from_db()
        self.assertEqual(self.note1.name, "test_name_new")

    def test_note_delete(self):
        notes_count = models.Note.objects.count()
        response = self.client.delete(
            reverse("homepage:notes"),
            data={"id": self.note1.id},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(models.Note.objects.count(), notes_count - 1)

    def test_note_put_not_found(self):
        response = self.client.put(
            reverse("homepage:notes"),
            data={
                "name": "test_name_new",
                "description": "new",
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    @patch("django.utils.timezone.now")
    def test_note_created_range_get(self, mock_now):
        mock_now.return_value = timezone.make_aware(
            datetime.datetime(2019, 1, 1, 0, 0, 0),
        )

        models.Note.objects.create(
            user=self.user,
            name="test_name_new",
            description="new",
        )

        not_include_interval = [
            datetime.datetime(2021, 1, 1, 0, 0, 0),
            datetime.datetime(2022, 1, 1, 0, 0, 0),
        ]

        not_include_interval = [
            str(el.timestamp()).split(".")[0] for el in not_include_interval
        ]

        include_interval = [
            datetime.datetime(2018, 1, 1, 0, 0, 0),
            datetime.datetime(2020, 1, 1, 0, 0, 0),
        ]

        include_interval = [
            str(el.timestamp()).split(".")[0] for el in include_interval
        ]

        data = json.dumps(
            {
                "created": not_include_interval,
            },
        )

        response = self.client.generic(
            path=reverse("homepage:notes"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(0, len(response.data))

        data = json.dumps(
            {
                "created": include_interval,
            },
        )

        response = self.client.generic(
            path=reverse("homepage:notes"),
            data=data,
            method="GET",
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(1, len(response.data))
