from django.contrib import admin
from homepage import models


class BaseAdmin(admin.ModelAdmin):
    list_display = ["name", "visible", "user"]
    search_fields = ["name"]
    list_filter = ["name"]


@admin.register(models.Activity)
class ActivityAdmin(BaseAdmin):
    list_display = ["name", "visible", "user", "icon_name", "icon_color"]


@admin.register(models.Factor)
class FactorAdmin(BaseAdmin):
    pass


@admin.register(models.Tag)
class TagAdmin(BaseAdmin):
    pass


@admin.register(models.Task)
class TaskAdmin(BaseAdmin):
    list_display = ["name", "description", "status", "user", "deadline"]


@admin.register(models.Score)
class ScoreAdmin(BaseAdmin):
    list_display = ["value", "factor"]
    list_filter = ["value", "factor"]
    ordering = ["value"]


@admin.register(models.Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["description", "created", "finished", "user"]
    search_fields = ["description"]
    list_filter = ["user"]
    ordering = ["created"]



