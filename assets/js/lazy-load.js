// Enhanced PWA JavaScript with modern features and optimizations

class LautnerApp {
    constructor() {
        this.isOnline = navigator.onLine;
        this.isTouch = 'ontouchstart' in window;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupTouchFeedback();
        this.setupNetworkStatus();
        this.setupPerformanceOptimizations();
        this.setupPWAFeatures();
        this.setupAccessibility();
        
        console.log('🚀 Lautner App initialized with modern PWA features');
    }
    
    // Enhanced lazy loading with better performance
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
            // Fallback for older browsers
            lazyImages.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        const src = img.dataset.src || img.src;
        if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            
            // Add loading animation
            img.style.opacity = '0';
            img.onload = () => {
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '1';
            };
        }
    }
    
    // Touch feedback for native-like interactions
    setupTouchFeedback() {
        if (!this.isTouch) return;
        
        // Add touch feedback to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .card, [role="button"]');
        
        interactiveElements.forEach(element => {
            element.classList.add('touch-feedback');
            
            element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            element.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: true });
        });
    }
    
    handleTouchStart(event) {
        const element = event.currentTarget;
        element.style.transform = 'scale(0.98)';
        element.style.transition = 'transform 0.1s ease';
        
        // Haptic feedback for supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(1);
        }
    }
    
    handleTouchEnd(event) {
        const element = event.currentTarget;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 50);
    }
    
    // Network status monitoring
    setupNetworkStatus() {
        const updateNetworkStatus = () => {
            this.isOnline = navigator.onLine;
            document.body.classList.toggle('offline', !this.isOnline);
            
            if (!this.isOnline) {
                this.showOfflineNotification();
            }
        };
        
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
        updateNetworkStatus();
    }
    
    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.className = 'offline-notification';
        notification.innerHTML = `
            <div class="notification-content">
                📱 You're offline - some features may be limited
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Performance optimizations
    setupPerformanceOptimizations() {
        // Preload critical resources on interaction
        let hasInteracted = false;
        const preloadOnInteraction = () => {
            if (hasInteracted) return;
            hasInteracted = true;
            
            // Preload fonts
            const fontLink = document.createElement('link');
            fontLink.rel = 'preload';
            fontLink.as = 'font';
            fontLink.type = 'font/woff2';
            fontLink.crossOrigin = 'anonymous';
            document.head.appendChild(fontLink);
        };
        
        ['mousedown', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, preloadOnInteraction, { once: true, passive: true });
        });
        
        // Intersection Observer for animations
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.card, .content-wrapper > *').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }
    
    // PWA-specific features
    setupPWAFeatures() {
        // Install prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPromotion();
        });
        
        // Track installation
        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA was installed successfully!');
            deferredPrompt = null;
        });
        
        // Share API
        if ('share' in navigator) {
            this.enableNativeSharing();
        }
        
        // Update available notification
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
    }
    
    showInstallPromotion() {
        // Only show on mobile devices
        if (!this.isTouch || this.isStandalone) return;
        
        const installBanner = document.createElement('div');
        installBanner.className = 'install-banner';
        installBanner.innerHTML = `
            <div class="install-content">
                <span>📱 Install Lautner app for the best experience!</span>
                <button class="install-btn">Install</button>
                <button class="dismiss-btn">×</button>
            </div>
        `;
        
        document.body.appendChild(installBanner);
        
        installBanner.querySelector('.install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);
                deferredPrompt = null;
            }
            installBanner.remove();
        });
        
        installBanner.querySelector('.dismiss-btn').addEventListener('click', () => {
            installBanner.remove();
        });
    }
    
    enableNativeSharing() {
        const shareButtons = document.querySelectorAll('[data-share]');
        shareButtons.forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    await navigator.share({
                        title: document.title,
                        text: document.querySelector('meta[name="description"]')?.content || '',
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Sharing failed:', err);
                }
            });
        });
    }
    
    // Accessibility enhancements
    setupAccessibility() {
        // Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Announce dynamic content changes to screen readers
        this.createAriaLiveRegion();
    }
    
    createAriaLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'aria-live-region';
        document.body.appendChild(liveRegion);
    }
    
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
}

// Additional CSS for new features
const additionalStyles = `
<style>
.loaded {
    animation: imageLoad 0.3s ease;
}

@keyframes imageLoad {
    from { opacity: 0; transform: scale(1.02); }
    to { opacity: 1; transform: scale(1); }
}

.offline-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 59, 48, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    z-index: 10000;
    animation: slideDown 0.3s ease;
}

.install-banner {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: var(--app-glass-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--app-glass-border);
    border-radius: 12px;
    padding: 16px;
    z-index: 10000;
    animation: slideUp 0.3s ease;
}

.install-content {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
}

.install-btn {
    background: var(--app-primary);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.dismiss-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    margin-left: auto;
}

.animate-in {
    animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from { transform: translateX(-50%) translateY(-100%); }
    to { transform: translateX(-50%) translateY(0); }
}

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

.keyboard-navigation *:focus {
    outline: 2px solid var(--app-primary) !important;
    outline-offset: 2px !important;
}

body.offline {
    filter: grayscale(0.3);
}
</style>
`;

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LautnerApp();
        document.head.insertAdjacentHTML('beforeend', additionalStyles);
    });
} else {
    new LautnerApp();
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
}

// Export for global access
window.LautnerApp = LautnerApp;