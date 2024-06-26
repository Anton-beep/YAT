from django.contrib import admin
from django.contrib.auth import get_user_model

__all__ = []

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "is_staff")
    search_fields = ("email",)
