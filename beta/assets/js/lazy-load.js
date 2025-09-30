// Enhanced PWA JavaScript - Clean and Fast

class LautnerApp {
    constructor() {
        this.isOnline = navigator.onLine;
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupNetworkStatus();
        this.setupAccessibility();
        console.log('Lautner App initialized');
    }
    
    // Enhanced lazy loading
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy, img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            lazyImages.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        const src = img.dataset.src || img.src;
        if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            
            img.style.opacity = '0';
            img.onload = () => {
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '1';
            };
        }
    }
    
    // Network status monitoring
    setupNetworkStatus() {
        const updateNetworkStatus = () => {
            this.isOnline = navigator.onLine;
            document.body.classList.toggle('offline', !this.isOnline);
        };
        
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
        updateNetworkStatus();
    }
    
    // Accessibility enhancements
    setupAccessibility() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new LautnerApp());
} else {
    new LautnerApp();
}
