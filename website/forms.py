from django import forms
from .models import Job
import re
from django.utils.html import strip_tags


class ContactForm(forms.Form):
    first_name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'First Name'
        })
    )
    last_name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Last Name'
        })
    )
    company = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Company'
        })
    )
    inquiry_type = forms.ChoiceField(
        choices=[
            ('', 'Please select...'),
            ('build-team', 'Looking to build a team'),
            ('applying', 'Applying'),
            ('other', 'Other inquiries'),
        ],
        required=True,
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )
    phone = forms.CharField(
        max_length=20,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '+1 (555) 123-4567',
            'type': 'tel'
        })
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email Address'
        })
    )
    message = forms.CharField(
        required=True,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 8,
            'placeholder': 'Your message...'
        })
    )

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if phone:
            # Remove all non-digit characters except +
            digits = re.sub(r'\D', '', phone.replace('+', ''))
            if not phone.startswith('+'):
                raise forms.ValidationError('Please include country code in phone number (e.g., +1 for USA).')
            if len(digits) < 10 or len(digits) > 15:
                raise forms.ValidationError('Please enter a valid phone number with country code (10-15 digits).')
        return phone


class JobApplicationForm(forms.Form):
    full_name = forms.CharField(
        max_length=200,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Full Name'
        })
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email Address'
        })
    )
    phone = forms.CharField(
        max_length=20,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Phone Number',
            'type': 'tel'
        })
    )
    street_address = forms.CharField(
        max_length=200,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Street Address'
        })
    )
    city = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'City'
        })
    )
    state = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'State'
        })
    )
    zip_code = forms.CharField(
        max_length=10,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'ZIP Code'
        })
    )
    visa_status = forms.ChoiceField(
        choices=[
            ('', 'Please select...'),
            ('US Citizen', 'US Citizen'),
            ('H1B', 'H1B'),
            ('Green Card', 'Green Card'),
        ],
        required=True,
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )
    resume = forms.FileField(
        required=True,
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': '.pdf,.doc,.docx'
        })
    )
    cover_letter = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 6,
            'placeholder': "Tell us why you're interested in this position..."
        })
    )

    def clean_zip_code(self):
        zip_code = self.cleaned_data.get('zip_code')
        if zip_code:
            zip_regex = re.compile(r'^\d{5}(-\d{4})?$')
            if not zip_regex.match(zip_code):
                raise forms.ValidationError('Please enter a valid ZIP code (e.g., 12345 or 12345-6789).')
        return zip_code

    def clean_resume(self):
        resume = self.cleaned_data.get('resume')
        if resume:
            # Check file size (5MB max)
            if resume.size > 5 * 1024 * 1024:
                raise forms.ValidationError('File size exceeds 5MB. Please choose a smaller file.')
            # Check file type
            allowed_types = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            if resume.content_type not in allowed_types:
                raise forms.ValidationError('Invalid file type. Please upload a PDF, DOC, or DOCX file.')
        return resume


class JobForm(forms.ModelForm):
    """Form for creating and updating job postings."""
    
    class Meta:
        model = Job
        fields = [
            'title', 'category', 'location', 'state', 'city', 'type', 'date',
            'detailed_description', 'is_active'
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Job Title'}),
            'category': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Software Development, Cloud'}),
            'location': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., San Francisco, CA or Remote'}),
            'state': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'State'}),
            'city': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'City'}),
            'type': forms.Select(attrs={'class': 'form-control'}),
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'detailed_description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 20,
                'style': 'min-height: 400px;',
                'placeholder': 'Enter the complete job description. A condensed version will automatically appear on the careers listing page.'
            }),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        help_texts = {
            'detailed_description': 'Enter the complete job description. A short version will automatically be created for the careers listing page.',
        }
    
    def save(self, commit=True):
        """Override save to auto-generate short description."""
        instance = super().save(commit=False)
        # Auto-generate short description from detailed description
        if instance.detailed_description:
            # Strip HTML tags first, then truncate to 200 characters
            text_only = strip_tags(instance.detailed_description)
            short_desc = text_only[:200].strip()
            if len(text_only) > 200:
                # Try to cut at a sentence or word boundary
                if '.' in short_desc:
                    short_desc = short_desc.rsplit('.', 1)[0] + '.'
                elif ' ' in short_desc:
                    short_desc = short_desc.rsplit(' ', 1)[0]
                short_desc += '...'
            instance.description = short_desc
        
        # Set empty values for fields not in form
        if not instance.responsibilities:
            instance.responsibilities = ''
        if not instance.required_qualifications:
            instance.required_qualifications = ''
        if not instance.preferred_qualifications:
            instance.preferred_qualifications = ''
        
        if commit:
            instance.save()
        return instance

