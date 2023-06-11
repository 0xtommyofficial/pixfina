from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.urls import reverse
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Favourites', {'fields': ('favourites_list',)}),
    )
    readonly_fields = ('favourites_list',)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

    def favourites_list(self, obj):
        """
        Creates a comma-separated list of links to the admin change page for each favourite.
        """
        return format_html(
            ', '.join(
                f'<a href="{reverse("admin:media_stockmedia_change", args=[favourite.id])}">{favourite.title}</a>'
                for favourite in obj.favourites.all()
            )
        )

    favourites_list.short_description = 'Favourites'


admin.site.register(CustomUser, CustomUserAdmin)
