from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType


class Command(BaseCommand):
    help = "Creates user groups and assigns permissions"

    def handle(self, *args, **options):
        # Create groups
        admin_group, created = Group.objects.get_or_create(name="Administrators")
        editor_group, created = Group.objects.get_or_create(name="Editors")
        journalist_group, created = Group.objects.get_or_create(name="Journalists")

        # Define permissions
        permissions = {
            admin_group: {
                "user": ["add", "change", "delete", "view"],
                "article": ["add", "change", "delete", "view"],
                "category": ["add", "change", "delete", "view"],
                "region": ["add", "change", "delete", "view"],
                "media": ["add", "change", "delete", "view"],
                "comment": ["add", "change", "delete", "view"],
            },
            editor_group: {
                "article": ["add", "change", "view", "publish"],
                "category": ["add", "change", "view"],
                "region": ["add", "change", "view"],
                "media": ["add", "change", "view"],
                "comment": ["add", "change", "view", "moderate"],
            },
            journalist_group: {
                "article": ["add", "change", "view"],
                "media": ["add", "view"],
            },
        }

        # Assign permissions
        for group, group_permissions in permissions.items():
            for model_name, model_permissions in group_permissions.items():
                content_type = ContentType.objects.get(
                    app_label="users" if model_name == "user" else "main",
                    model=model_name,
                )
                for permission_codename in model_permissions:
                    permission = Permission.objects.get(
                        content_type=content_type, codename=permission_codename
                    )
                    group.permissions.add(permission)

        self.stdout.write(
            self.style.SUCCESS("Successfully created groups and assigned permissions.")
        )
