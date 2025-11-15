from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('job_number', 'title', 'category', 'location', 'type', 'date', 'is_active', 'created_at')
    list_filter = ('is_active', 'type', 'category', 'date')
    search_fields = ('title', 'job_number', 'category', 'location')
    readonly_fields = ('job_number', 'created_at', 'updated_at')
    ordering = ('-date', '-created_at')

