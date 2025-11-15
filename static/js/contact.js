document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const phoneInput = document.getElementById('phone');

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
                    // For simplicity, add space after 2-3 digits
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
            // Allow + key at the start
            if (e.keyCode === 187 && (e.target.value.length === 0 || e.target.selectionStart === 0)) {
                return;
            }
            // Ensure that it is a number
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const company = document.getElementById('company').value.trim();
            const inquiryType = document.getElementById('inquiryType').value;
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate form
            if (!firstName || !lastName || !inquiryType || !phone || !email || !message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Validate phone number format (must include country code)
            // Phone should start with + and have at least 10 digits after country code
            const phoneDigits = phone.replace(/\D/g, '');
            const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
            
            if (!phone.startsWith('+')) {
                showMessage('Please include country code in phone number (e.g., +1 for USA).', 'error');
                return;
            }
            
            if (phoneDigits.length < 10 || phoneDigits.length > 15) {
                showMessage('Please enter a valid phone number with country code (10-15 digits).', 'error');
                return;
            }

            // Prepare form data
            const formData = {
                firstName: firstName,
                lastName: lastName,
                company: company,
                inquiryType: inquiryType,
                phone: phone,
                email: email,
                message: message
            };

            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            console.log('Form submitted:', formData);

            // Show success message
            showMessage('Thank you for contacting us! We will get back to you soon.', 'success');

            // Reset form
            contactForm.reset();

            // Hide message after 5 seconds
            setTimeout(function() {
                formMessage.classList.add('hidden');
            }, 5000);
        });
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.classList.remove('hidden');
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

