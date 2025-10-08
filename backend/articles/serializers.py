from rest_framework import serializers
from .models import Article, Region, Tag, MediaAsset
from users.models import User
from categories.models import Category

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name_fr', 'name_ar', 'slug']

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name_fr', 'name_ar', 'slug']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name_fr', 'name_ar', 'slug']

class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = ['id', 'asset_name', 'type', 'storage_url', 'alt_text_fr', 'alt_text_ar']

class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    editor = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    hero_media = MediaAssetSerializer(read_only=True)
    region_tags = RegionSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = '__all__'