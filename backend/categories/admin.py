from django.contrib import admin
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name_fr', 'name_ar', 'slug', 'parent', 'weight')
    list_filter = ('parent',)
    search_fields = ('name_fr', 'name_ar', 'slug')
    ordering = ('weight', 'name_fr')
    prepopulated_fields = {'slug': ('name_fr',)}