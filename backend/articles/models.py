import uuid
from django.db import models
from django.conf import settings

class Region(models.Model):
    """
    Represents a Tunisian governorate or other region.
    """
    class RegionType(models.TextChoices):
        GOVERNORATE = 'governorate', 'Governorate'
        MUNICIPALITY = 'municipality', 'Municipality'
        NATIONAL = 'national', 'National'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_fr = models.CharField(max_length=255)
    name_ar = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    governorate_code = models.CharField(max_length=10, blank=True, null=True)
    region_type = models.CharField(max_length=20, choices=RegionType.choices, default=RegionType.GOVERNORATE)
    color = models.CharField(max_length=7, blank=True, null=True)
    coordinates = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name_fr

class Tag(models.Model):
    """
    Represents a tag that can be applied to articles.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_fr = models.CharField(max_length=255)
    name_ar = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name_fr

class MediaAsset(models.Model):
    """
    Represents a media file, such as an image or video.
    """
    class AssetType(models.TextChoices):
        IMAGE = 'image', 'Image'
        VIDEO = 'video', 'Video'
        AUDIO = 'audio', 'Audio'

    class LicenseType(models.TextChoices):
        INTERNAL = 'internal', 'Internal'
        CC_BY = 'cc_by', 'Creative Commons BY'
        CC_BY_SA = 'cc_by_sa', 'Creative Commons BY-SA'
        ALL_RIGHTS_RESERVED = 'all_rights_reserved', 'All Rights Reserved'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset_name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=AssetType.choices)
    storage_url = models.URLField()
    alt_text_fr = models.CharField(max_length=255, blank=True, null=True)
    alt_text_ar = models.CharField(max_length=255, blank=True, null=True)
    caption_fr = models.TextField(blank=True, null=True)
    caption_ar = models.TextField(blank=True, null=True)
    credit = models.CharField(max_length=255, blank=True, null=True)
    license = models.CharField(max_length=50, choices=LicenseType.choices, default=LicenseType.INTERNAL)
    focal_point = models.CharField(max_length=50, blank=True, null=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.asset_name

class Article(models.Model):
    """
    Represents a single news article.
    """
    class Locale(models.TextChoices):
        AR = 'ar', 'Arabic'
        FR = 'fr', 'French'

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        IN_REVIEW = 'in_review', 'In Review'
        APPROVED = 'approved', 'Approved'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    locale = models.CharField(max_length=2, choices=Locale.choices)
    rtl = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, unique=True)
    body = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='authored_articles')
    editor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='edited_articles')
    category = models.ForeignKey('categories.Category', on_delete=models.SET_NULL, null=True)
    hero_media = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name='hero_for_articles')
    featured = models.BooleanField(default=False)
    reading_time_min = models.IntegerField(default=0)
    publish_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    canonical_url = models.URLField(blank=True, null=True)
    seo_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    source_urls = models.JSONField(blank=True, null=True)
    region_tags = models.ManyToManyField(Region, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    hreflang_peer = models.OneToOneField('self', on_delete=models.SET_NULL, null=True, blank=True)
    version = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.locale == self.Locale.AR:
            self.rtl = True
        else:
            self.rtl = False
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title