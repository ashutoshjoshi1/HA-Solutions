// Modern JavaScript with enhanced animations and interactions
(function() {
    'use strict';

    // ==================== POPUP FUNCTIONALITY ====================
    function openPopup() {
        const popup = document.getElementById('searchPopup');
        if (popup) {
            popup.classList.remove('hidden');
            // Focus on search input
            setTimeout(() => {
                const input = document.getElementById('searchInput');
                if (input) input.focus();
            }, 100);
        }
    }

    function closePopup() {
        const popup = document.getElementById('searchPopup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

    // Close popup on background click
    document.addEventListener('click', function(e) {
        const popup = document.getElementById('searchPopup');
        if (popup && e.target === popup && !popup.classList.contains('hidden')) {
            closePopup();
        }
    });

    // ==================== SEARCH FUNCTIONALITY ====================
    document.addEventListener('DOMContentLoaded', function() {
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        
        if (searchButton && searchInput) {
            const performSearch = function() {
                const searchTerm = searchInput.value.trim();
                if (searchTerm !== '') {
                    console.log('Searching for:', searchTerm);
                    // Add your search logic here
                    closePopup();
                    searchInput.value = '';
                }
            };

            searchButton.addEventListener('click', performSearch);

            // Allow Enter key to trigger search
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });
        }
    });

    // ==================== SMOOTH SCROLL ====================
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '#top') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    });

    // ==================== INTERSECTION OBSERVER ANIMATIONS ====================
    document.addEventListener('DOMContentLoaded', function() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        const animateElements = document.querySelectorAll('.card, .webinar-card, .hero-content, .section-title');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Style for fade-in class
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    });

    // ==================== MOBILE MENU ====================
    document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const dropdownToggles = document.querySelectorAll('.dropdown > a, .sub-dropdown > a');

        // Create mobile menu toggle button if it doesn't exist
        if (!menuToggle && window.innerWidth <= 768) {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const toggle = document.createElement('div');
                toggle.id = 'mobile-menu-toggle';
                toggle.className = 'mobile-menu-toggle';
                toggle.innerHTML = '<span></span><span></span><span></span>';
                
                const logoParent = navbar.querySelector('.logo');
                if (logoParent) {
                    navbar.insertBefore(toggle, logoParent);
                }
            }
        }

        // Toggle mobile menu
        if (document.getElementById('mobile-menu-toggle')) {
            document.getElementById('mobile-menu-toggle').addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu?.classList.toggle('active');
                document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Handle dropdown menus on mobile
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    const menu = parent.querySelector('.dropdown-menu, .sub-dropdown-menu');
                    
                    if (menu) {
                        menu.classList.toggle('show');
                    }
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            const toggle = document.getElementById('mobile-menu-toggle');
            if (navMenu && toggle && !toggle.contains(e.target) && !navMenu.contains(e.target)) {
                if (window.innerWidth <= 768) {
                    toggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // ==================== STICKY HEADER SCROLL ====================
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ==================== BACK TO TOP BUTTON ====================
    window.addEventListener('scroll', function() {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        }
    });

    // Initialize back-to-top button
    document.addEventListener('DOMContentLoaded', function() {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
            backToTop.style.transition = 'opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease';
            
            // Add smooth scroll behavior
            backToTop.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    });

    // ==================== CARD TILT EFFECT ====================
    document.addEventListener('DOMContentLoaded', function() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    });

    // ==================== PARALLAX EFFECT FOR HERO ====================
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // ==================== BUTTON RIPPLE EFFECT ====================
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple CSS
        const style = document.createElement('style');
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    });

    // ==================== LAZY LOADING IMAGES ====================
    document.addEventListener('DOMContentLoaded', function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    });

    // ==================== FORM VALIDATION ====================
    document.addEventListener('DOMContentLoaded', function() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    alert('Please fill in all required fields.');
                }
            });

            // Remove error class on input
            form.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                });
            });
        });
    });

    // ==================== ENHANCED DROPDOWN MENUS ====================
    document.addEventListener('DOMContentLoaded', function() {
        if (window.innerWidth > 768) {
            const dropdowns = document.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                let timeout;
                
                dropdown.addEventListener('mouseenter', function() {
                    clearTimeout(timeout);
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    const menu = this.querySelector('.dropdown-menu');
                    if (menu) {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                    }
                });
            });
        }
    });

    // ==================== SCROLL PROGRESS BAR ====================
    document.addEventListener('DOMContentLoaded', function() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    });

    // ==================== PERFORMANCE OPTIMIZATION ====================
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll events
    window.scroll = debounce(window.scroll, 10);

    // ==================== CONSOLE MESSAGE ====================
    console.log('%cHA Solutions', 'font-size: 20px; font-weight: bold; color: #0066cc;');
    console.log('%cModern Technology Talent Solutions', 'font-size: 12px; color: #666;');

})();
