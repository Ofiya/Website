// Enhanced JavaScript for CCC Redemption Parish
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CCC Redemption Parish - Enhanced Website Loaded');
    
    // ===== NAVIGATION ENHANCEMENTS =====
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // ===== BACKGROUND CAROUSEL ENHANCEMENT =====
    const backgroundImages = [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1515507566291-40d2bd5d11e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ];
    
    function initializeCarousel() {
        const carouselSlides = document.getElementById('carouselSlides');
        if (!carouselSlides) return;
        
        // Create slides
        backgroundImages.forEach((imageUrl, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `url('${imageUrl}')`;
            slide.setAttribute('data-index', index);
            carouselSlides.appendChild(slide);
        });
        
        // Create navigation dots
        const navDots = document.createElement('div');
        navDots.className = 'carousel-nav';
        navDots.innerHTML = backgroundImages.map((_, i) => 
            `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`
        ).join('');
        
        // Add navigation to hero
        const hero = document.querySelector('.hero-carousel');
        if (hero) {
            hero.appendChild(navDots);
        }
        
        let currentSlide = 0;
        
        // Function to change slide
        function changeSlide(index) {
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = index;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        // Auto rotate slides every 6 seconds
        let slideInterval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % backgroundImages.length;
            changeSlide(nextSlide);
        }, 6000);
        
        // Pause on hover
        hero.addEventListener('mouseenter', () => clearInterval(slideInterval));
        hero.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                const nextSlide = (currentSlide + 1) % backgroundImages.length;
                changeSlide(nextSlide);
            }, 6000);
        });
        
        // Dot navigation
        document.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                changeSlide(index);
                clearInterval(slideInterval);
            });
        });
    }
    
    // ===== LAZY LOADING IMAGES =====
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ===== FORM ENHANCEMENTS =====
    function enhanceForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                const originalState = submitBtn.disabled;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Show success message
                    showNotification('Message sent successfully! We will get back to you soon.', 'success');
                    
                    // Reset form
                    this.reset();
                } catch (error) {
                    showNotification('Sorry, there was an error. Please try again later.', 'error');
                    console.error('Form submission error:', error);
                } finally {
                    // Restore button state
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = originalState;
                }
            });
        });
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // ===== SMOOTH SCROLLING =====
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ===== ANIMATION ON SCROLL =====
    function initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.project-card, .event-card, .address-box').forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===== CURRENT YEAR IN FOOTER =====
    function updateCurrentYear() {
        const yearElements = document.querySelectorAll('[data-current-year]');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
    
    // ===== INITIALIZE ALL FUNCTIONS =====
    initializeCarousel();
    initializeLazyLoading();
    enhanceForms();
    initializeSmoothScroll();
    initializeScrollAnimations();
    updateCurrentYear();
    
    // Add CSS for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            transform: translateX(100%);
            opacity: 0;
            transition: all var(--transition-normal);
            max-width: 400px;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-success {
            border-left: 4px solid var(--success);
        }
        
        .notification-error {
            border-left: 4px solid var(--error);
        }
        
        .notification i {
            font-size: 1.25rem;
        }
        
        .notification-success i {
            color: var(--success);
        }
        
        .notification-error i {
            color: var(--error);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--gray-400);
            cursor: pointer;
            padding: 0.25rem;
            margin-left: auto;
        }
        
        .carousel-nav {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
            z-index: 10;
        }
        
        .carousel-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            background: transparent;
            cursor: pointer;
            transition: all var(--transition-fast);
        }
        
        .carousel-dot.active {
            background: var(--secondary-main);
            border-color: var(--secondary-main);
            transform: scale(1.2);
        }
        
        .carousel-dot:hover {
            background: rgba(255, 255, 255, 0.5);
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
    `;
    document.head.appendChild(notificationStyles);
});