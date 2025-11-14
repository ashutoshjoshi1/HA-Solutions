// Careers Application Page JavaScript
(function() {
    'use strict';

    // Get job title from URL parameter
    function getJobFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const jobTitle = urlParams.get('job');
        const jobId = urlParams.get('id');
        
        if (jobTitle) {
            const jobTitleDisplay = document.getElementById('jobTitleDisplay');
            if (jobTitleDisplay) {
                jobTitleDisplay.textContent = decodeURIComponent(jobTitle);
            }
        }
    }

    // Handle file upload display
    function initFileUpload() {
        const fileInput = document.getElementById('resume');
        const fileNameDisplay = document.getElementById('fileNameDisplay');

        if (fileInput && fileNameDisplay) {
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Check file size (5MB max)
                    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                    if (file.size > maxSize) {
                        alert('File size exceeds 5MB. Please choose a smaller file.');
                        fileInput.value = '';
                        fileNameDisplay.textContent = '';
                        return;
                    }

                    // Check file type
                    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!allowedTypes.includes(file.type)) {
                        alert('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
                        fileInput.value = '';
                        fileNameDisplay.textContent = '';
                        return;
                    }

                    fileNameDisplay.textContent = `Selected: ${file.name}`;
                    fileNameDisplay.style.display = 'block';
                } else {
                    fileNameDisplay.textContent = '';
                    fileNameDisplay.style.display = 'none';
                }
            });
        }
    }

    // Handle form submission
    function initFormSubmission() {
        const form = document.getElementById('applicationForm');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Get form data
                const formData = new FormData(form);
                const jobTitle = document.getElementById('jobTitleDisplay')?.textContent || 'General Application';
                formData.append('jobTitle', jobTitle);

                // Get job ID from URL if available
                const urlParams = new URLSearchParams(window.location.search);
                const jobId = urlParams.get('id');
                if (jobId) {
                    formData.append('jobId', jobId);
                }

                // Validate form
                const fullName = document.getElementById('fullName').value.trim();
                const email = document.getElementById('email').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const resume = document.getElementById('resume').files[0];

                if (!fullName || !email || !phone || !resume) {
                    alert('Please fill in all required fields.');
                    return;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }

                // Validate phone format (basic validation)
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
                    alert('Please enter a valid phone number.');
                    return;
                }

                // Show loading state
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';

                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    // In a real application, you would send the formData to your server
                    // Example: fetch('/api/apply', { method: 'POST', body: formData })
                    
                    console.log('Application submitted:', {
                        jobTitle: jobTitle,
                        fullName: fullName,
                        email: email,
                        phone: phone,
                        resume: resume.name
                    });

                    // Show success message
                    alert('Thank you for your application! We will review your submission and get back to you soon.');
                    
                    // Reset form
                    form.reset();
                    document.getElementById('fileNameDisplay').textContent = '';
                    document.getElementById('fileNameDisplay').style.display = 'none';
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;

                    // Optionally redirect to careers page
                    // window.location.href = 'careers.html';
                }, 1000);
            });
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        getJobFromURL();
        initFileUpload();
        initFormSubmission();
    });

})();

