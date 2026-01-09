// Simple JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Celestial Church of Christ Redemption Parish website loaded');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Image loading optimization
    const images = document.querySelectorAll('.church-image');
    images.forEach(img => {
        // Add loading="lazy" for better performance
        img.setAttribute('loading', 'lazy');
    });
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Display current year in copyright
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Highlight next upcoming service
    highlightNextService();
});

function highlightNextService() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    // Remove any existing highlights
    document.querySelectorAll('.service-card, .service-detail-card').forEach(card => {
        card.classList.remove('upcoming-service');
    });
    
    // Determine which service is next
    let nextService = null;
    
    if (day === 0 && hour < 10) { // Sunday before 10 AM
        nextService = document.querySelector('[data-service="sunday"]');
    } else if (day === 3) { // Wednesday
        if (hour < 9) {
            nextService = document.querySelector('[data-service="seeker"]');
        } else if (hour < 18) {
            nextService = document.querySelector('[data-service="mercy"]');
        }
    }
    
    // Highlight the next service
    if (nextService) {
        nextService.classList.add('upcoming-service');
        nextService.style.boxShadow = '0 0 0 3px #3498db';
    }
}