// Enhanced Carousel Component
class Carousel {
    constructor(container, options = {}) {
        this.container = container;
        this.slides = container.querySelectorAll('.carousel-slide');
        this.dotsContainer = null;
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.isAnimating = false;
        
        // Options with defaults
        this.options = {
            autoplay: true,
            interval: 6000,
            loop: true,
            showDots: true,
            showArrows: true,
            animationType: 'fade', // 'fade', 'slide', or 'zoom'
            pauseOnHover: true,
            touchEnabled: true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        // Create carousel structure
        this.createStructure();
        
        // Set initial active slide
        this.goToSlide(0);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay();
        }
        
        // Initialize touch/swipe if enabled
        if (this.options.touchEnabled) {
            this.initTouchEvents();
        }
    }
    
    createStructure() {
        // Create navigation dots if enabled
        if (this.options.showDots) {
            this.dotsContainer = document.createElement('div');
            this.dotsContainer.className = 'carousel-dots';
            
            this.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.setAttribute('data-index', index);
                dot.innerHTML = '<span class="sr-only">Slide ' + (index + 1) + '</span>';
                
                dot.addEventListener('click', () => this.goToSlide(index));
                
                this.dotsContainer.appendChild(dot);
            });
            
            this.container.appendChild(this.dotsContainer);
        }
        
        // Create navigation arrows if enabled
        if (this.options.showArrows) {
            const prevArrow = document.createElement('button');
            prevArrow.className = 'carousel-arrow carousel-arrow-prev';
            prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i><span class="sr-only">Previous slide</span>';
            prevArrow.addEventListener('click', () => this.prevSlide());
            
            const nextArrow = document.createElement('button');
            nextArrow.className = 'carousel-arrow carousel-arrow-next';
            nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i><span class="sr-only">Next slide</span>';
            nextArrow.addEventListener('click', () => this.nextSlide());
            
            this.container.appendChild(prevArrow);
            this.container.appendChild(nextArrow);
        }
        
        // Create counter if more than one slide
        if (this.slides.length > 1) {
            const counter = document.createElement('div');
            counter.className = 'carousel-counter';
            counter.innerHTML = `
                <span class="carousel-current">1</span>
                <span class="carousel-separator">/</span>
                <span class="carousel-total">${this.slides.length}</span>
            `;
            this.container.appendChild(counter);
        }
    }
    
    setupEventListeners() {
        // Pause on hover if enabled
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
        }
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
            }
        });
        
        // Visibility API - pause when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else if (this.options.autoplay) {
                this.resumeAutoplay();
            }
        });
    }
    
    initTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            
            // Calculate swipe distance
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Only process horizontal swipes with minimal vertical movement
            if (Math.abs(diffX) > 50 && Math.abs(diffY) < 50) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Calculate actual index based on looping
        let newIndex = index;
        if (this.options.loop) {
            if (index < 0) {
                newIndex = this.slides.length - 1;
            } else if (index >= this.slides.length) {
                newIndex = 0;
            }
        } else {
            newIndex = Math.max(0, Math.min(index, this.slides.length - 1));
        }
        
        // Remove active class from current slide
        this.slides[this.currentIndex].classList.remove('active');
        
        // Update current index
        this.currentIndex = newIndex;
        
        // Add active class to new slide with animation
        this.animateSlideTransition(this.slides[this.currentIndex]);
        
        // Update dots
        this.updateDots();
        
        // Update counter
        this.updateCounter();
        
        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('slideChange', {
            detail: { currentIndex: this.currentIndex }
        }));
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    animateSlideTransition(slide) {
        const animationClass = `slide-in-${this.options.animationType}`;
        slide.classList.add(animationClass);
        
        setTimeout(() => {
            slide.classList.add('active');
            slide.classList.remove(animationClass);
        }, 50);
    }
    
    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }
    
    updateDots() {
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
                dot.setAttribute('aria-current', index === this.currentIndex ? 'true' : 'false');
            });
        }
    }
    
    updateCounter() {
        const counterCurrent = this.container.querySelector('.carousel-current');
        if (counterCurrent) {
            counterCurrent.textContent = this.currentIndex + 1;
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.interval);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resumeAutoplay() {
        if (this.options.autoplay && !this.autoplayInterval) {
            this.startAutoplay();
        }
    }
    
    destroy() {
        // Clean up all event listeners and intervals
        this.pauseAutoplay();
        
        // Remove created elements
        if (this.dotsContainer) {
            this.dotsContainer.remove();
        }
        
        const arrows = this.container.querySelectorAll('.carousel-arrow');
        arrows.forEach(arrow => arrow.remove());
        
        const counter = this.container.querySelector('.carousel-counter');
        if (counter) counter.remove();
    }
}

// Initialize carousels on page load
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(container => {
        const options = {
            autoplay: container.dataset.autoplay !== 'false',
            interval: parseInt(container.dataset.interval) || 6000,
            loop: container.dataset.loop !== 'false',
            showDots: container.dataset.dots !== 'false',
            showArrows: container.dataset.arrows !== 'false',
            animationType: container.dataset.animation || 'fade',
            pauseOnHover: container.dataset.pauseHover !== 'false',
            touchEnabled: container.dataset.touch !== 'false'
        };
        
        new Carousel(container, options);
    });
});

// CSS for carousel component (should be added to your CSS)
const carouselStyles = `
/* ===== CAROUSEL COMPONENT STYLES ===== */
.carousel-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.8s ease, transform 0.8s ease;
    transform: translateX(100%);
    z-index: 1;
}

.carousel-slide.active {
    opacity: 1;
    transform: translateX(0);
    z-index: 2;
}

.carousel-slide.slide-in-fade {
    transform: translateX(0);
}

.carousel-slide.slide-in-slide {
    transform: translateX(100%);
}

.carousel-slide.slide-in-zoom {
    transform: scale(1.1) translateX(0);
}

.carousel-dots {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.75rem;
    z-index: 10;
}

.carousel-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
}

.carousel-dot:hover {
    background: rgba(255, 255, 255, 0.5);
}

.carousel-dot.active {
    background: var(--secondary-main);
    border-color: var(--secondary-main);
    transform: scale(1.2);
}

.carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
}

.carousel-arrow:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
}

.carousel-arrow-prev {
    left: 2rem;
}

.carousel-arrow-next {
    right: 2rem;
}

.carousel-arrow i {
    font-size: 1.25rem;
}

.carousel-counter {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    z-index: 10;
}

.carousel-current {
    font-size: 1.125rem;
}

.carousel-separator {
    margin: 0 0.25rem;
    opacity: 0.7;
}

/* Accessibility */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .carousel-arrow {
        width: 40px;
        height: 40px;
    }
    
    .carousel-arrow-prev {
        left: 1rem;
    }
    
    .carousel-arrow-next {
        right: 1rem;
    }
    
    .carousel-dots {
        bottom: 1rem;
    }
}
`;

// Add carousel styles to document
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = carouselStyles;
    document.head.appendChild(style);
});