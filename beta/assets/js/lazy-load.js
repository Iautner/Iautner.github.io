// Modern Link Tree - Optimized Performance

class LinkTreeApp {
    constructor() {
        this.isOnline = navigator.onLine;
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupNetworkStatus();
        this.setupAccessibility();
        console.log('Link Tree initialized');
    }
    
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy, img[data-src]');
        
        if ('IntersectionObserver' in window && lazyImages.length) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
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
    
    setupNetworkStatus() {
        const updateStatus = () => {
            this.isOnline = navigator.onLine;
            document.body.classList.toggle('offline', !this.isOnline);
        };
        
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }
    
    setupAccessibility() {
        let isTabbing = false;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !isTabbing) {
                isTabbing = true;
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            if (isTabbing) {
                isTabbing = false;
                document.body.classList.remove('keyboard-navigation');
            }
        });
    }
}

// Initialize efficiently
document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', () => new LinkTreeApp())
    : new LinkTreeApp();
