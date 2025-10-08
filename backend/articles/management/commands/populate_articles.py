import random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from faker import Faker
from articles.models import Article
from users.models import User
from categories.models import Category

class Command(BaseCommand):
    help = 'Populates the database with sample articles.'

    def handle(self, *args, **options):
        self.stdout.write('Starting to populate the database...')

        fake = Faker()

        # Create a user
        user, created = User.objects.get_or_create(
            email='demo@example.com',
            defaults={'name': 'Demo User'}
        )
        if created:
            user.set_password('password')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created user: {user.email}'))

        # Create a category
        category, created = Category.objects.get_or_create(
            name_fr="Actualités",
            defaults={
                'name_ar': "أخبار",
                'slug': 'actualites',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created category: {category.name_fr}'))

        # Create articles
        for i in range(10):
            title = fake.sentence(nb_words=6)
            locale = random.choice([Article.Locale.FR, Article.Locale.AR])
            article_data = {
                'title': title,
                'subtitle': fake.sentence(nb_words=10),
                'locale': locale,
                'slug': slugify(title),
                'body': fake.text(max_nb_chars=2000),
                'author': user,
                'category': category,
                'status': Article.Status.PUBLISHED,
                'publish_date': fake.date_time_this_year(),
            }

            # Ensure slug is unique
            if Article.objects.filter(slug=article_data['slug']).exists():
                article_data['slug'] = f"{article_data['slug']}-{i}"

            Article.objects.create(**article_data)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with 10 articles.'))