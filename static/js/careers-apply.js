// Job Application Form - Client-side validation only (email sent via Django backend)
document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('applicationForm');
    const resumeInput = document.getElementById('id_resume');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    // Handle file upload display
    if (resumeInput && fileNameDisplay) {
        resumeInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check file size (5MB max)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    alert('File size exceeds 5MB. Please choose a smaller file.');
                    resumeInput.value = '';
                    fileNameDisplay.textContent = '';
                    fileNameDisplay.style.display = 'none';
                    return;
                }

                // Check file type
                const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                if (!allowedTypes.includes(file.type)) {
                    alert('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
                    resumeInput.value = '';
                    fileNameDisplay.textContent = '';
                    fileNameDisplay.style.display = 'none';
                    return;
                }

                fileNameDisplay.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
                fileNameDisplay.style.display = 'block';
            } else {
                fileNameDisplay.textContent = '';
                fileNameDisplay.style.display = 'none';
            }
        });
    }

    // Format file size for display
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Client-side form validation
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            // Get form values
            const fullName = document.getElementById('id_full_name') ? document.getElementById('id_full_name').value.trim() : '';
            const email = document.getElementById('id_email') ? document.getElementById('id_email').value.trim() : '';
            const phone = document.getElementById('id_phone') ? document.getElementById('id_phone').value.trim() : '';
            const streetAddress = document.getElementById('id_street_address') ? document.getElementById('id_street_address').value.trim() : '';
            const city = document.getElementById('id_city') ? document.getElementById('id_city').value.trim() : '';
            const state = document.getElementById('id_state') ? document.getElementById('id_state').value.trim() : '';
            const zipCode = document.getElementById('id_zip_code') ? document.getElementById('id_zip_code').value.trim() : '';
            const visaStatus = document.getElementById('id_visa_status') ? document.getElementById('id_visa_status').value : '';
            const resume = resumeInput ? resumeInput.files[0] : null;

            // Validate form
            if (!fullName || !email || !phone || !streetAddress || !city || !state || !zipCode || !visaStatus || !resume) {
                e.preventDefault();
                alert('Please fill in all required fields.');
                return false;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return false;
            }

            // Validate ZIP code format (5 digits or 5+4 format)
            const zipRegex = /^\d{5}(-\d{4})?$/;
            if (!zipRegex.test(zipCode)) {
                e.preventDefault();
                alert('Please enter a valid ZIP code (e.g., 12345 or 12345-6789).');
                return false;
            }

            // Validate phone format
            const phoneDigits = phone.replace(/\D/g, '');
            if (phoneDigits.length < 10 || phoneDigits.length > 15) {
                e.preventDefault();
                alert('Please enter a valid phone number.');
                return false;
            }

            // If all validations pass, allow form submission (Django will handle email sending)
            return true;
        });
    }
});
