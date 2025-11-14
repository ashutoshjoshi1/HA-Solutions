// Careers Page JavaScript
(function() {
    'use strict';

    let allJobs = [];
    let filteredJobs = [];
    let activeFilters = {
        keyword: '',
        categories: [],
        states: [],
        cities: []
    };

    // Embedded jobs data (fallback if JSON file can't be loaded)
    const embeddedJobsData = {
        "jobs": [
            {
                "id": 1,
                "title": "Senior Software Engineer",
                "category": "Software Development",
                "location": "San Francisco, CA",
                "state": "California",
                "city": "San Francisco",
                "type": "Hybrid",
                "date": "2025-01-15",
                "description": "We are seeking a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining scalable software solutions. The ideal candidate has 5+ years of experience in full-stack development, strong problem-solving skills, and experience with cloud technologies."
            },
            {
                "id": 2,
                "title": "DevOps Engineer",
                "category": "Cloud",
                "location": "Remote",
                "state": "Remote",
                "city": "Remote",
                "type": "Remote",
                "date": "2025-01-14",
                "description": "Join our DevOps team to help build and maintain our infrastructure. You'll work with cutting-edge technologies including Kubernetes, Docker, AWS, and CI/CD pipelines. We're looking for someone with strong automation skills and experience in cloud infrastructure management."
            },
            {
                "id": 3,
                "title": "Data Scientist",
                "category": "Software Development",
                "location": "New York, NY",
                "state": "New York",
                "city": "New York",
                "type": "On-site",
                "date": "2025-01-13",
                "description": "We're looking for a Data Scientist to help drive data-driven decision making. You'll work with large datasets, build predictive models, and collaborate with cross-functional teams. Experience with Python, machine learning frameworks, and statistical analysis is required."
            },
            {
                "id": 4,
                "title": "Frontend Developer",
                "category": "Software Development",
                "location": "Austin, TX",
                "state": "Texas",
                "city": "Austin",
                "type": "Hybrid",
                "date": "2025-01-12",
                "description": "Seeking a talented Frontend Developer to create beautiful and intuitive user interfaces. You'll work with modern frameworks like React, Vue, or Angular, and collaborate closely with designers and backend developers. Strong CSS and JavaScript skills are essential."
            },
            {
                "id": 5,
                "title": "Cloud Solutions Architect",
                "category": "Cloud",
                "location": "Seattle, WA",
                "state": "Washington",
                "city": "Seattle",
                "type": "Remote",
                "date": "2025-01-11",
                "description": "We need a Cloud Solutions Architect to design and implement scalable cloud infrastructure. You'll work with AWS, Azure, or GCP to create robust solutions for our clients. Strong architectural skills and cloud certifications are preferred."
            }
        ]
    };

    // Load jobs from JSON file (with multiple fallbacks)
    async function loadJobs() {
        // First, try to get data from embedded script tag in HTML
        const embeddedScript = document.getElementById('jobs-data');
        if (embeddedScript) {
            try {
                const data = JSON.parse(embeddedScript.textContent);
                allJobs = data.jobs || [];
                initializeFilters();
                filterJobs();
                return;
            } catch (e) {
                console.warn('Could not parse embedded jobs data, trying fetch...');
            }
        }

        // Second, try to fetch from JSON file
        try {
            const response = await fetch('data/jobs.json');
            if (!response.ok) {
                throw new Error('Failed to load jobs from file');
            }
            const data = await response.json();
            allJobs = data.jobs || [];
            initializeFilters();
            filterJobs();
        } catch (error) {
            console.warn('Could not load jobs.json file, using embedded JS data:', error);
            // Final fallback to embedded data in JS file
            try {
                allJobs = embeddedJobsData.jobs || [];
                initializeFilters();
                filterJobs();
            } catch (fallbackError) {
                console.error('Error loading embedded jobs:', fallbackError);
                const container = document.getElementById('jobsContainer');
                if (container) {
                    container.innerHTML = 
                        '<div class="error-message">Unable to load job openings. Please try again later.</div>';
                }
            }
        }
    }

    // Initialize filter options from jobs data
    function initializeFilters() {
        const categories = new Set();
        const states = new Set();
        const cities = new Set();

        allJobs.forEach(job => {
            if (job.category) categories.add(job.category);
            if (job.state) states.add(job.state);
            if (job.city) cities.add(job.city);
        });

        // Populate category filters
        const categoryContainer = document.getElementById('categoryFilters');
        if (categoryContainer) {
            const sortedCategories = Array.from(categories).sort();
            categoryContainer.innerHTML = sortedCategories.map(cat => {
                const count = allJobs.filter(j => j.category === cat).length;
                return `
                    <label class="filter-checkbox">
                        <input type="checkbox" value="${escapeHtml(cat)}" data-filter="category">
                        <span>${escapeHtml(cat)} (${count})</span>
                    </label>
                `;
            }).join('');
        }

        // Populate state filters
        const stateContainer = document.getElementById('stateFilters');
        if (stateContainer) {
            const sortedStates = Array.from(states).sort();
            stateContainer.innerHTML = sortedStates.map(state => {
                const count = allJobs.filter(j => j.state === state).length;
                return `
                    <label class="filter-checkbox">
                        <input type="checkbox" value="${escapeHtml(state)}" data-filter="state">
                        <span>${escapeHtml(state)} (${count})</span>
                    </label>
                `;
            }).join('');
        }

        // Populate city filters
        const cityContainer = document.getElementById('cityFilters');
        if (cityContainer) {
            const sortedCities = Array.from(cities).sort();
            cityContainer.innerHTML = sortedCities.map(city => {
                const count = allJobs.filter(j => j.city === city).length;
                return `
                    <label class="filter-checkbox">
                        <input type="checkbox" value="${escapeHtml(city)}" data-filter="city">
                        <span>${escapeHtml(city)} (${count})</span>
                    </label>
                `;
            }).join('');
        }

        // Attach event listeners
        attachFilterListeners();
    }

    // Attach event listeners to filters
    function attachFilterListeners() {
        // Keyword search
        const keywordSearch = document.getElementById('keywordSearch');
        if (keywordSearch) {
            keywordSearch.addEventListener('input', function() {
                activeFilters.keyword = this.value.toLowerCase().trim();
                filterJobs();
            });
        }

        // Category, state, and city checkboxes
        document.querySelectorAll('input[data-filter]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const filterType = this.getAttribute('data-filter');
                const value = this.value;

                if (this.checked) {
                    if (!activeFilters[filterType + 's'].includes(value)) {
                        activeFilters[filterType + 's'].push(value);
                    }
                } else {
                    activeFilters[filterType + 's'] = activeFilters[filterType + 's'].filter(v => v !== value);
                }
                filterJobs();
            });
        });
    }

    // Filter jobs based on active filters
    function filterJobs() {
        filteredJobs = allJobs.filter(job => {
            // Keyword filter
            if (activeFilters.keyword) {
                const searchText = activeFilters.keyword;
                const searchableText = `${job.title} ${job.description} ${job.location} ${job.category || ''}`.toLowerCase();
                if (!searchableText.includes(searchText)) {
                    return false;
                }
            }

            // Category filter
            if (activeFilters.categories.length > 0) {
                if (!activeFilters.categories.includes(job.category)) {
                    return false;
                }
            }

            // State filter
            if (activeFilters.states.length > 0) {
                if (!activeFilters.states.includes(job.state)) {
                    return false;
                }
            }

            // City filter
            if (activeFilters.cities.length > 0) {
                if (!activeFilters.cities.includes(job.city)) {
                    return false;
                }
            }

            return true;
        });

        displayJobs(filteredJobs);
        updateJobCount();
    }

    // Update job count
    function updateJobCount() {
        const jobCountElement = document.getElementById('jobCount');
        if (jobCountElement) {
            jobCountElement.textContent = filteredJobs.length;
        }
    }

    // Display jobs in the container
    function displayJobs(jobs) {
        const container = document.getElementById('jobsContainer');
        const noJobsMessage = document.getElementById('noJobsMessage');

        if (jobs.length === 0) {
            container.innerHTML = '';
            noJobsMessage.classList.remove('hidden');
            return;
        }

        noJobsMessage.classList.add('hidden');
        
        container.innerHTML = jobs.map(job => createJobCard(job)).join('');
    }

    // Create HTML for a single job card
    function createJobCard(job) {
        const formattedDate = formatDate(job.date);
        const category = job.category || 'Other';
        
        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-card-header">
                    <h3 class="job-title">${escapeHtml(job.title)}</h3>
                    <span class="job-date">${formattedDate}</span>
                </div>
                <div class="job-category">${escapeHtml(category)}</div>
                ${job.location && job.location !== 'Remote' ? `
                    <div class="job-location-info">
                        <span class="location-icon">📍</span>
                        <span>${escapeHtml(job.location)}</span>
                    </div>
                ` : ''}
                <div class="job-description">
                    <p>${escapeHtml(job.description)}</p>
                </div>
                <div class="job-actions">
                    <a href="careers-apply.html?job=${encodeURIComponent(job.title)}&id=${job.id}" class="btn btn-primary btn-apply">Apply Now</a>
                </div>
            </div>
        `;
    }

    // Format date from YYYY-MM-DD to readable format
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        loadJobs();
    });

})();

