// Popup functionality
function openPopup() {
    document.getElementById('searchPopup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('searchPopup').classList.add('hidden');
}

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value;
            if (searchTerm.trim() !== '') {
                console.log('Searching for:', searchTerm);
                // Add your search logic here
                closePopup();
            }
        });

        // Allow Enter key to trigger search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#top') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('.card, .webinar-card');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Mobile menu toggle (if needed)
    // You can add a hamburger menu for mobile devices if desired
});

// Handle dropdown menus on mobile
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        const dropdownToggles = document.querySelectorAll('.dropdown > a, .sub-dropdown > a');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const parent = this.parentElement;
                const menu = parent.querySelector('.dropdown-menu, .sub-dropdown-menu');
                
                if (menu) {
                    const isVisible = menu.style.display === 'block';
                    menu.style.display = isVisible ? 'none' : 'block';
                }
            });
        });
    }
});

// Back to top functionality
window.addEventListener('scroll', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
    }
});

// Initialize back-to-top button
document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
        backToTop.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    }
});

