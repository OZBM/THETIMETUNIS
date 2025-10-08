from django.contrib import admin
from .models import Article, Region, Tag, MediaAsset

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'locale', 'publish_date', 'featured')
    list_filter = ('status', 'locale', 'featured', 'category', 'region_tags')
    search_fields = ('title', 'subtitle', 'body')
    ordering = ('-publish_date',)
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('region_tags', 'tags')

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name_fr', 'name_ar', 'slug', 'region_type')
    list_filter = ('region_type',)
    search_fields = ('name_fr', 'name_ar', 'slug')
    prepopulated_fields = {'slug': ('name_fr',)}

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name_fr', 'name_ar', 'slug')
    search_fields = ('name_fr', 'name_ar', 'slug')
    prepopulated_fields = {'slug': ('name_fr',)}

@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ('asset_name', 'type', 'uploaded_by', 'created_at')
    list_filter = ('type',)
    search_fields = ('asset_name', 'credit')
    ordering = ('-created_at',)