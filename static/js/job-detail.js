// Job Detail Page JavaScript
(function() {
    'use strict';

    // Embedded jobs data (fallback if JSON file can't be loaded)
    // Note: This is a simplified version - full details should be loaded from data/jobs.json
    const embeddedJobsData = {
        "jobs": []
    };

    // Load job details
    async function loadJobDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = parseInt(urlParams.get('id'));

        if (!jobId || isNaN(jobId)) {
            displayError('No valid job ID provided.');
            return;
        }

        let jobs = [];

        // Try to load from embedded script tag (if available)
        const embeddedScript = document.getElementById('jobs-data');
        if (embeddedScript) {
            try {
                const data = JSON.parse(embeddedScript.textContent);
                jobs = data.jobs || [];
                console.log('Loaded jobs from embedded script:', jobs.length);
            } catch (e) {
                console.warn('Could not parse embedded jobs data:', e);
            }
        }

        // If no embedded data, try to fetch from JSON file
        if (jobs.length === 0) {
            try {
                const response = await fetch('data/jobs.json');
                if (response.ok) {
                    const data = await response.json();
                    jobs = data.jobs || [];
                    console.log('Loaded jobs from JSON file:', jobs.length);
                } else {
                    console.warn('Failed to fetch jobs.json:', response.status);
                }
            } catch (error) {
                console.warn('Could not load jobs.json file:', error);
            }
        }

        // Final fallback to embedded data in JS file
        if (jobs.length === 0) {
            jobs = embeddedJobsData.jobs || [];
            console.log('Using embedded JS data:', jobs.length);
        }

        console.log('Total jobs loaded:', jobs.length);
        console.log('Looking for job ID:', jobId);
        console.log('Available job IDs:', jobs.map(j => j.id));

        // Find the job by ID
        const job = jobs.find(j => j.id === jobId);

        if (!job) {
            displayError('Job not found. Please check the job ID and try again.');
            return;
        }

        displayJobDetail(job);
    }

    // Display job details
    function displayJobDetail(job) {
        const container = document.getElementById('jobDetailContent');
        if (!container) return;

        const formattedDate = formatDate(job.date);
        const category = job.category || 'Other';

        container.innerHTML = `
            <div class="job-detail-header">
                <h1 class="job-detail-title">${escapeHtml(job.title)}</h1>
                <div class="job-detail-meta">
                    <span class="job-detail-category">${escapeHtml(category)}</span>
                    ${job.location ? `
                        <span class="job-detail-location">
                            <span class="location-icon">📍</span>
                            ${escapeHtml(job.location)}
                        </span>
                    ` : ''}
                    ${job.type ? `
                        <span class="job-detail-type">${escapeHtml(job.type)}</span>
                    ` : ''}
                    <span class="job-detail-date">${formattedDate}</span>
                </div>
            </div>

            <div class="job-detail-body">
                <div class="job-detail-description">
                    <h2>Job Description</h2>
                    <p>${escapeHtml(job.detailedDescription || job.description)}</p>
                </div>

                ${job.responsibilities && job.responsibilities.length > 0 ? `
                    <div class="job-detail-section">
                        <h2>Responsibilities</h2>
                        <ul>
                            ${Array.isArray(job.responsibilities) 
                                ? job.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')
                                : `<li>${escapeHtml(job.responsibilities)}</li>`
                            }
                        </ul>
                    </div>
                ` : ''}

                ${job.requiredQualifications && job.requiredQualifications.length > 0 ? `
                    <div class="job-detail-section">
                        <h2>Required Qualifications</h2>
                        <ul>
                            ${Array.isArray(job.requiredQualifications) 
                                ? job.requiredQualifications.map(r => `<li>${escapeHtml(r)}</li>`).join('')
                                : `<li>${escapeHtml(job.requiredQualifications)}</li>`
                            }
                        </ul>
                    </div>
                ` : ''}

                ${job.preferredQualifications && job.preferredQualifications.length > 0 ? `
                    <div class="job-detail-section">
                        <h2>Preferred Qualifications</h2>
                        <ul>
                            ${Array.isArray(job.preferredQualifications) 
                                ? job.preferredQualifications.map(p => `<li>${escapeHtml(p)}</li>`).join('')
                                : `<li>${escapeHtml(job.preferredQualifications)}</li>`
                            }
                        </ul>
                    </div>
                ` : ''}
            </div>

            <div class="job-detail-actions">
                <a href="careers-apply.html?job=${encodeURIComponent(job.title)}&id=${job.id}" class="btn btn-primary btn-apply-large">Apply Now</a>
            </div>
        `;

        // Update page title
        document.title = `${job.title} - HA Solutions`;
    }

    // Display error message
    function displayError(message) {
        const container = document.getElementById('jobDetailContent');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>${escapeHtml(message)}</p>
                    <a href="careers.html" class="btn btn-primary">Back to Careers</a>
                </div>
            `;
        }
    }

    // Format date from YYYY-MM-DD to readable format
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        loadJobDetail();
    });

})();

