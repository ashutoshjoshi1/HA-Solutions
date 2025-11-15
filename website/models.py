from django.db import models
from django.contrib.auth.models import User
from django.utils.html import strip_tags
import uuid


class Job(models.Model):
    """Job posting model with unique job number."""
    
    # Auto-generated unique job number
    job_number = models.CharField(max_length=20, unique=True, editable=False)
    
    # Basic Information
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default='Other')
    location = models.CharField(max_length=200)
    state = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    type = models.CharField(max_length=50, choices=[
        ('Remote', 'Remote'),
        ('Hybrid', 'Hybrid'),
        ('On-site', 'On-site'),
    ], default='Remote')
    date = models.DateField()
    
    # Descriptions
    description = models.TextField(blank=True, help_text="Short description for careers listing page (auto-generated)")
    detailed_description = models.TextField(help_text="Full detailed description for job detail page")
    
    # Responsibilities (stored as JSON-like text, can be converted to list)
    responsibilities = models.TextField(blank=True, default='', help_text="Enter each responsibility on a new line")
    
    # Qualifications (stored as JSON-like text)
    required_qualifications = models.TextField(blank=True, default='', help_text="Enter each qualification on a new line")
    preferred_qualifications = models.TextField(blank=True, default='', help_text="Enter each qualification on a new line")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, help_text="Uncheck to hide from careers page")
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.job_number} - {self.title}"
    
    def save(self, *args, **kwargs):
        """Generate unique job number if not set and auto-generate short description."""
        if not self.job_number:
            # Generate format: JOB-YYYYMMDD-XXXX (e.g., JOB-20250115-1234)
            from datetime import date
            today = date.today()
            date_str = today.strftime('%Y%m%d')
            # Get last 4 digits of UUID
            unique_id = str(uuid.uuid4())[:4].upper()
            self.job_number = f"JOB-{date_str}-{unique_id}"
        
        # Auto-generate short description from detailed description if not set
        if self.detailed_description and not self.description:
            # Strip HTML tags first, then truncate to 200 characters
            text_only = strip_tags(self.detailed_description)
            self.description = text_only[:200].strip()
            if len(text_only) > 200:
                # Try to cut at a sentence or word boundary
                if '.' in self.description:
                    self.description = self.description.rsplit('.', 1)[0] + '.'
                elif ' ' in self.description:
                    self.description = self.description.rsplit(' ', 1)[0]
                self.description += '...'
        
        super().save(*args, **kwargs)
    
    def get_responsibilities_list(self):
        """Convert responsibilities text to list."""
        if not self.responsibilities:
            return []
        return [r.strip() for r in self.responsibilities.split('\n') if r.strip()]
    
    def get_required_qualifications_list(self):
        """Convert required qualifications text to list."""
        if not self.required_qualifications:
            return []
        return [q.strip() for q in self.required_qualifications.split('\n') if q.strip()]
    
    def get_preferred_qualifications_list(self):
        """Convert preferred qualifications text to list."""
        if not self.preferred_qualifications:
            return []
        return [q.strip() for q in self.preferred_qualifications.split('\n') if q.strip()]

