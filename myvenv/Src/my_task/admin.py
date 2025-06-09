from django.contrib import admin
from .models import JegyzetelosFelhasznalo

@admin.register(JegyzetelosFelhasznalo)
class JegyzetelosFelhasznaloAdmin(admin.ModelAdmin):
    list_display = ('user', 'email', 'aktiv')
    list_filter = ('aktiv',)
    search_fields = ('user__username', 'email')
    fieldsets = (
        ('Felhasználói adatok', {
            'fields': ('user', 'email', 'aktiv')
        }),
    )
