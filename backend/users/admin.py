from django.contrib import admin
from .models import User, Role

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'status', 'is_staff')
    list_filter = ('status', 'role', 'is_staff', 'is_superuser')
    search_fields = ('email', 'name')
    ordering = ('email',)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)