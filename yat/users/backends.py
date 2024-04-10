from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

__all__ = []

User = get_user_model()


class AuthentificationBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)

        case_insensitive_username_field = "{}__iexact".format(
            User.USERNAME_FIELD,
        )
        users = User._default_manager.filter(
            Q(**{case_insensitive_username_field: username})
            | Q(email__iexact=username),
        )

        # Test whether any matched user has the provided password:
        for user in users:
            if user.check_password(password) and self.user_can_authenticate(
                user,
            ):
                return user

        if not users:
            User().set_password(password)

        return None
