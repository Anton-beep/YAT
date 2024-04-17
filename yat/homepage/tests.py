from http import HTTPStatus

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from homepage import models


__all__ = []


User = get_user_model()


class ActivityTestCase(APITestCase):
    user = None
    client = None

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.client = APIClient()

        cls.user = User.objects.create_user(
            email="testUserHomepage@mail.com",
            password="testUserHomepagePassword",
            first_name="Test",
            last_name="Homepage",
            is_active=True,
        )
        cls.user.save()

        cls.token = str(AccessToken.for_user(cls.user))

        cls.client.credentials(HTTP_AUTHORIZATION=f"Bearer {cls.token}")

        # test activities
        cls.activity1 = models.Activity.objects.create(
            user=cls.user,
            name="test_name1",
            icon_name="test_icon_name",
            icon_color="test_icon_color",
        )

        cls.activity2 = models.Activity.objects.create(
            user=cls.user,
            name="test_name2",
            icon_name="test_icon_name",
            icon_color="test_icon_color",
        )

    def test_activity_get(self):
        activity_count = models.Activity.objects.count()
        response = self.client.get(
            reverse("homepage:activities"),
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(activity_count, len(response.data))

    def test_activity_post(self):
        activity_count = models.Activity.objects.count()
        response = self.client.post(
            reverse("homepage:activities"),
            data={
                "name": "test_name_new",
                "icon": {"name": "test_icon_name", "color": "test_icon_color"},
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(activity_count + 1, models.Activity.objects.count())

    def test_activity_put(self):
        response = self.client.put(
            reverse("homepage:activities"),
            data={
                "id": self.activity1.id,
                "name": "test_name_new",
                "icon": {"name": "test_icon_name", "color": "test_icon_color"},
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.activity1.refresh_from_db()
        self.assertEqual(self.activity1.name, "test_name_new")

    def test_activity_delete(self):
        response = self.client.delete(
            reverse("homepage:activities"),
            data={"id": self.activity1.id},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(models.Activity.objects.count(), 1)

    def test_activity_put_not_found(self):
        response = self.client.put(
            reverse("homepage:activities"),
            data={
                "name": "test_name_new",
                "icon": {"name": "test_icon_name", "color": "test_icon_color"},
            },
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)


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
        self.assertEqual(tag_count, len(response.data))

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

    def test_tag_post(self):
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

    def test_tag_put(self):
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

    def test_tag_delete(self):
        notes_count = models.Note.objects.count()
        response = self.client.delete(
            reverse("homepage:notes"),
            data={"id": self.note1.id},
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(models.Note.objects.count(), notes_count - 1)

    def test_tag_put_not_found(self):
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
