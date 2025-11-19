// Contact form handling - Client-side validation only (email sent via Django backend)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('id_phone');
    const attachmentInput = document.getElementById('id_attachment');
    const fileDisplay = document.getElementById('fileDisplay');
    const fileName = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFile');

    // File upload display and handling
    if (attachmentInput) {
        attachmentInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (10MB max)
                const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                if (file.size > maxSize) {
                    alert('File size exceeds 10MB. Please choose a smaller file.');
                    e.target.value = '';
                    fileDisplay.style.display = 'none';
                    return;
                }

                // Validate file type
                const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain',
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif'
                ];
                if (!allowedTypes.includes(file.type)) {
                    alert('Invalid file type. Please upload a PDF, DOC, DOCX, TXT, or image file.');
                    e.target.value = '';
                    fileDisplay.style.display = 'none';
                    return;
                }

                // Display file name
                fileName.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
                fileDisplay.style.display = 'block';
            } else {
                fileDisplay.style.display = 'none';
            }
        });
    }

    // Remove file button
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', function() {
            if (attachmentInput) {
                attachmentInput.value = '';
                fileDisplay.style.display = 'none';
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

    // Phone number formatting and validation
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let input = e.target.value;
            let digits = input.replace(/\D/g, ''); // Remove all non-digits
            
            // Format: +1 (555) 123-4567 for US numbers, or +44 1234567890 for international
            let formatted = '';
            if (digits.length > 0) {
                // Check if it's a US number (starts with 1)
                if (digits[0] === '1' && digits.length >= 4) {
                    // US format: +1 (555) 123-4567
                    formatted = '+1';
                    let number = digits.substring(1); // Remove the leading 1
                    if (number.length > 0) {
                        formatted += ' (' + number.substring(0, 3);
                    }
                    if (number.length > 3) {
                        formatted += ') ' + number.substring(3, 6);
                    }
                    if (number.length > 6) {
                        formatted += '-' + number.substring(6, 10);
                    }
                } else {
                    // International format: +44 1234567890
                    formatted = '+' + digits.substring(0, 15); // Max 15 digits
                    // Add space after country code (typically 1-3 digits)
                    if (formatted.length > 4) {
                        let countryCodeLength = formatted.length > 5 ? 3 : 2;
                        formatted = formatted.substring(0, countryCodeLength + 1) + ' ' + formatted.substring(countryCodeLength + 1);
                    }
                }
            }
            
            e.target.value = formatted;
        });

        phoneInput.addEventListener('keydown', function(e) {
            // Allow backspace, delete, tab, escape, enter, and + key
            if ([8, 9, 27, 13, 46, 187].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            // Ensure that it is a number
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }

    // Client-side form validation
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form values
            const firstName = document.getElementById('id_first_name') ? document.getElementById('id_first_name').value.trim() : '';
            const lastName = document.getElementById('id_last_name') ? document.getElementById('id_last_name').value.trim() : '';
            const inquiryType = document.getElementById('id_inquiry_type') ? document.getElementById('id_inquiry_type').value : '';
            const phone = document.getElementById('id_phone') ? document.getElementById('id_phone').value.trim() : '';
            const email = document.getElementById('id_email') ? document.getElementById('id_email').value.trim() : '';
            const message = document.getElementById('id_message') ? document.getElementById('id_message').value.trim() : '';

            // Validate form
            if (!firstName || !lastName || !inquiryType || !phone || !email || !message) {
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

            // Validate phone number format (must include country code)
            const phoneDigits = phone.replace(/\D/g, '');
            if (!phone.startsWith('+')) {
                e.preventDefault();
                alert('Please include country code in phone number (e.g., +1 for USA).');
                return false;
            }
            if (phoneDigits.length < 10 || phoneDigits.length > 15) {
                e.preventDefault();
                alert('Please enter a valid phone number with country code (10-15 digits).');
                return false;
            }

            // If all validations pass, allow form submission (Django will handle email sending)
            return true;
        });
    }
});
