from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from django.views.decorators.http import require_http_methods
from django.contrib import messages
from .models import Job
import json
import os

from .forms import ContactForm, JobApplicationForm


def index(request):
    """Home page view."""
    return render(request, 'website/index.html')


def contact(request):
    """Contact page view with form handling."""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Send email
            subject = f"Contact Form Submission - {form.cleaned_data['inquiry_type']}"
            
            # Create email body
            message = f"""
New contact form submission from HA Solutions website:

Name: {form.cleaned_data['first_name']} {form.cleaned_data['last_name']}
Company: {form.cleaned_data['company'] or 'N/A'}
Inquiry Type: {form.cleaned_data['inquiry_type']}
Email: {form.cleaned_data['email']}
Phone: {form.cleaned_data['phone']}

Message:
{form.cleaned_data['message']}
"""
            
            try:
                # Use EMAIL_HOST_USER as from_email if available, otherwise use DEFAULT_FROM_EMAIL
                from_email = settings.EMAIL_HOST_USER or settings.DEFAULT_FROM_EMAIL
                
                # If using console backend, from_email can be any value
                if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
                    from_email = from_email or 'noreply@hasolutions.us'
                
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=from_email,
                    recipient_list=[settings.CONTACT_EMAIL],
                    fail_silently=False,
                )
                messages.success(request, 'Thank you for contacting us! We will get back to you soon.')
                return redirect('contact')
            except Exception as e:
                error_msg = str(e)
                # Provide user-friendly error message
                if 'not authenticated' in error_msg.lower() or '530' in error_msg:
                    messages.error(request, 'Email authentication failed. Please check email server configuration.')
                elif 'EMAIL_HOST_USER' in error_msg or 'authentication' in error_msg.lower():
                    messages.error(request, 'Email service not configured. Please contact the administrator.')
                else:
                    messages.error(request, f'There was an error sending your message. Please try again later.')
                # Log the full error for debugging (in production, use proper logging)
                print(f"Email error: {error_msg}")
    else:
        form = ContactForm()
    
    return render(request, 'website/contact.html', {'form': form})


def careers(request):
    """Careers page view."""
    # Get active jobs from database
    jobs = Job.objects.filter(is_active=True).order_by('-date', '-created_at')
    
    # Convert to JSON format for JavaScript compatibility
    jobs_list = []
    for job in jobs:
        jobs_list.append({
            'id': job.id,
            'job_number': job.job_number,
            'title': job.title,
            'category': job.category,
            'location': job.location,
            'state': job.state,
            'city': job.city,
            'type': job.type,
            'date': job.date.strftime('%Y-%m-%d'),
            'description': job.description,
            'detailedDescription': job.detailed_description,
            'responsibilities': job.get_responsibilities_list(),
            'requiredQualifications': job.get_required_qualifications_list(),
            'preferredQualifications': job.get_preferred_qualifications_list(),
        })
    
    jobs_json = json.dumps({'jobs': jobs_list})
    import time
    timestamp = int(time.time())
    return render(request, 'website/careers.html', {'jobs': jobs_json, 'jobs_list': jobs, 'timestamp': timestamp})


def job_detail(request, job_id):
    """Job detail page view."""
    job = get_object_or_404(Job, id=job_id, is_active=True)
    
    # Clean up the detailed description - normalize line breaks and ensure proper paragraph structure
    detailed_desc = job.detailed_description
    if detailed_desc:
        # Replace Windows line breaks
        detailed_desc = detailed_desc.replace('\r\n', '\n').replace('\r', '\n')
        # If content is in a single <p> tag with line breaks, split it into multiple paragraphs
        import re
        if detailed_desc.count('<p>') == 1 and detailed_desc.count('</p>') == 1:
            # Extract content between <p> and </p>
            match = re.search(r'<p[^>]*>(.*?)</p>', detailed_desc, re.DOTALL)
            if match:
                content = match.group(1)
                # Split by double line breaks to create paragraphs
                paragraphs = re.split(r'\n\s*\n+', content)
                # Rebuild with proper <p> tags, preserving formatting
                detailed_desc = ''.join(['<p>' + p.strip().replace('\n', '<br>') + '</p>' for p in paragraphs if p.strip()])
    
    # Convert to dict format for template compatibility
    job_dict = {
        'id': job.id,
        'job_number': job.job_number,
        'title': job.title,
        'category': job.category,
        'location': job.location,
        'state': job.state,
        'city': job.city,
        'type': job.type,
        'date': job.date,
        'description': job.description,
        'detailedDescription': detailed_desc,
        'responsibilities': job.get_responsibilities_list(),
        'requiredQualifications': job.get_required_qualifications_list(),
        'preferredQualifications': job.get_preferred_qualifications_list(),
    }
    
    return render(request, 'website/careers-job-detail.html', {'job': job_dict})


def careers_apply(request):
    """Job application page view."""
    job_title = request.GET.get('job', 'General Application')
    job_id = request.GET.get('id')
    
    if request.method == 'POST':
        form = JobApplicationForm(request.POST, request.FILES)
        if form.is_valid():
            # Send email with application
            subject = f"Job Application - {job_title}"
            
            # Create email body
            message = f"""
New job application from HA Solutions website:

Position: {job_title}
Name: {form.cleaned_data['full_name']}
Email: {form.cleaned_data['email']}
Phone: {form.cleaned_data['phone']}
Address: {form.cleaned_data['street_address']}
City: {form.cleaned_data['city']}
State: {form.cleaned_data['state']}
ZIP Code: {form.cleaned_data['zip_code']}
Visa Status: {form.cleaned_data['visa_status']}

Cover Letter:
{form.cleaned_data['cover_letter'] or 'N/A'}
"""
            
            try:
                # Use EMAIL_HOST_USER as from_email if available, otherwise use DEFAULT_FROM_EMAIL
                from_email = settings.EMAIL_HOST_USER or settings.DEFAULT_FROM_EMAIL
                
                # If using console backend, from_email can be any value
                if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
                    from_email = from_email or 'noreply@hasolutions.us'
                
                email = EmailMessage(
                    subject=subject,
                    body=message,
                    from_email=from_email,
                    to=[settings.CONTACT_EMAIL],
                )
                
                # Attach resume
                if form.cleaned_data['resume']:
                    email.attach(
                        form.cleaned_data['resume'].name,
                        form.cleaned_data['resume'].read(),
                        form.cleaned_data['resume'].content_type
                    )
                
                email.send()
                messages.success(request, 'Thank you for your application! We will review your submission and get back to you soon.')
                return redirect('careers')
            except Exception as e:
                error_msg = str(e)
                # Provide user-friendly error message
                if 'not authenticated' in error_msg.lower() or '530' in error_msg:
                    messages.error(request, 'Email authentication failed. Please check email server configuration.')
                elif 'EMAIL_HOST_USER' in error_msg or 'authentication' in error_msg.lower():
                    messages.error(request, 'Email service not configured. Please contact the administrator.')
                else:
                    messages.error(request, f'There was an error submitting your application. Please try again later.')
                # Log the full error for debugging (in production, use proper logging)
                print(f"Email error: {error_msg}")
    else:
        form = JobApplicationForm()
    
    return render(request, 'website/careers-apply.html', {
        'form': form,
        'job_title': job_title,
        'job_id': job_id
    })


# Static page views
def companies_index(request):
    return render(request, 'website/companies/index.html')


def about(request):
    return render(request, 'website/about/about.html')


def about_team(request):
    return render(request, 'website/about/about-team.html')


def about_partnerships(request):
    return render(request, 'website/about/about-partnerships.html')


def candidates(request):
    return render(request, 'website/candidates/candidates.html')


def candidates_veterans(request):
    return render(request, 'website/candidates/candidates-veterans.html')


def candidates_training(request):
    return render(request, 'website/candidates/candidates-training.html')


def candidates_career(request):
    return render(request, 'website/candidates/candidates-career.html')


def federal(request):
    return render(request, 'website/federal.html')


# Technology pages
def technology_aws(request):
    return render(request, 'website/technology/technology-aws.html')


def technology_databricks(request):
    return render(request, 'website/technology/technology-databricks.html')


def technology_mulesoft(request):
    return render(request, 'website/technology/technology-mulesoft.html')


def technology_pega(request):
    return render(request, 'website/technology/technology-pega.html')


def technology_salesforce(request):
    return render(request, 'website/technology/technology-salesforce.html')


def technology_sap(request):
    return render(request, 'website/technology/technology-sap.html')


def technology_servicenow(request):
    return render(request, 'website/technology/technology-servicenow.html')


def technology_workday(request):
    return render(request, 'website/technology/technology-workday.html')


# Industry pages
def industry_data_centers(request):
    return render(request, 'website/industry/industry-data-centers.html')


def industry_financial(request):
    return render(request, 'website/industry/industry-financial.html')


def industry_healthcare(request):
    return render(request, 'website/industry/industry-healthcare.html')


def industry_semiconductor(request):
    return render(request, 'website/industry/industry-semiconductor.html')


def industry_telecommunications(request):
    return render(request, 'website/industry/industry-telecommunications.html')
