import uuid
from django.db import models

class Category(models.Model):
    """
    Represents a content category, e.g., Politics, Economy, Sports.
    Categories can be hierarchical.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_fr = models.CharField(max_length=255)
    name_ar = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text="A unique, URL-friendly name for the category.")
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    color = models.CharField(max_length=7, blank=True, null=True, help_text="A hex color code for the category, e.g., #FF5733.")
    weight = models.IntegerField(default=0, help_text="An integer to determine the order of categories.")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['weight', 'name_fr']

    def __str__(self):
        return self.name_fr