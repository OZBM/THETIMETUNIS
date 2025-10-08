from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for viewing published articles, ordered by publication date.
    """
    queryset = Article.objects.filter(status=Article.Status.PUBLISHED).order_by('-publish_date')
    serializer_class = ArticleSerializer