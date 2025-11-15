from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from .models import Job
from .forms import JobForm
from django.contrib.auth import logout


def recruiter_login(request):
    """Recruiter login page."""
    if request.user.is_authenticated:
        return redirect('recruiter_dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        
        if not username or not password:
            messages.error(request, 'Please enter both username and password.')
        else:
            # Try authenticating with username first
            user = authenticate(request, username=username, password=password)
            
            # If that fails, try finding user by email and authenticate with their username
            if user is None:
                try:
                    from django.contrib.auth import get_user_model
                    User = get_user_model()
                    # Try to find user by username or email
                    try:
                        user_obj = User.objects.get(username=username)
                    except User.DoesNotExist:
                        try:
                            user_obj = User.objects.get(email=username)
                        except User.DoesNotExist:
                            user_obj = None
                    
                    if user_obj:
                        # Try authenticating with the found user's username
                        user = authenticate(request, username=user_obj.username, password=password)
                except Exception as e:
                    # Log error for debugging
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Login error: {e}")
            
            if user is not None and user.is_active:
                login(request, user)
                messages.success(request, 'Welcome back!')
                return redirect('recruiter_dashboard')
            else:
                messages.error(request, 'Invalid username or password. Please check your credentials.')
    
    return render(request, 'website/recruiter/login.html')


@login_required
def recruiter_dashboard(request):
    """Recruiter dashboard showing all jobs."""
    jobs = Job.objects.all().order_by('-created_at')
    return render(request, 'website/recruiter/dashboard.html', {'jobs': jobs})


@login_required
def create_job(request):
    """Create a new job posting."""
    if request.method == 'POST':
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit=True)
            # Ensure short description is generated
            if job.detailed_description and not job.description:
                short_desc = job.detailed_description[:200].strip()
                if len(job.detailed_description) > 200:
                    if '.' in short_desc:
                        short_desc = short_desc.rsplit('.', 1)[0] + '.'
                    elif ' ' in short_desc:
                        short_desc = short_desc.rsplit(' ', 1)[0]
                    short_desc += '...'
                job.description = short_desc
                job.save()
            messages.success(request, f'Job "{job.title}" created successfully with job number {job.job_number}!')
            return redirect('recruiter_dashboard')
    else:
        form = JobForm()
    
    return render(request, 'website/recruiter/create_job.html', {'form': form})


@login_required
def update_job(request, job_id):
    """Update an existing job posting."""
    job = get_object_or_404(Job, id=job_id)
    
    if request.method == 'POST':
        form = JobForm(request.POST, instance=job)
        if form.is_valid():
            updated_job = form.save(commit=True)
            # Regenerate short description from detailed description
            if updated_job.detailed_description:
                short_desc = updated_job.detailed_description[:200].strip()
                if len(updated_job.detailed_description) > 200:
                    if '.' in short_desc:
                        short_desc = short_desc.rsplit('.', 1)[0] + '.'
                    elif ' ' in short_desc:
                        short_desc = short_desc.rsplit(' ', 1)[0]
                    short_desc += '...'
                updated_job.description = short_desc
                updated_job.save()
            messages.success(request, f'Job "{updated_job.title}" updated successfully!')
            return redirect('recruiter_dashboard')
    else:
        form = JobForm(instance=job)
    
    return render(request, 'website/recruiter/update_job.html', {'form': form, 'job': job})


@login_required
def delete_job(request):
    """Delete job(s) - shows list to select from."""
    if request.method == 'POST':
        job_id = request.POST.get('job_id')
        if job_id:
            job = get_object_or_404(Job, id=job_id)
            job_title = job.title
            job_number = job.job_number
            job.delete()
            messages.success(request, f'Job "{job_title}" (Job #{job_number}) deleted successfully!')
            return redirect('recruiter_dashboard')
        else:
            messages.error(request, 'Please select a job to delete.')
    
    jobs = Job.objects.all().order_by('-created_at')
    return render(request, 'website/recruiter/delete_job.html', {'jobs': jobs})


@login_required
def delete_job_confirm(request, job_id):
    """Confirm and delete a specific job."""
    job = get_object_or_404(Job, id=job_id)
    
    if request.method == 'POST':
        job_title = job.title
        job_number = job.job_number
        job.delete()
        messages.success(request, f'Job "{job_title}" (Job #{job_number}) deleted successfully!')
        return redirect('recruiter_dashboard')
    
    return render(request, 'website/recruiter/delete_confirm.html', {'job': job})


@login_required
def recruiter_logout(request):
    """Logout recruiter."""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('recruiter_login')

