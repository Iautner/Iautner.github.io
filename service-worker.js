
    // Enhanced Service Worker with modern PWA capabilities
    // Optimized for app-like experience across all devices

    const CACHE_NAME = 'lautner-app-v2.0';
    const RUNTIME_CACHE = 'lautner-runtime-v2.0';
    const OFFLINE_CACHE = 'lautner-offline-v2.0';
    
    const HOSTNAME_WHITELIST = [
        self.location.hostname,
        'fonts.gstatic.com',
        'fonts.googleapis.com',
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com',
        'unpkg.com'
    ];
    
    // Critical resources to cache immediately
    const CRITICAL_RESOURCES = [
        '/',
        '/index.html',
        '/assets/css/primer.css',
        '/assets/css/custom.css',
        '/assets/css/bootstrap-icons.css',
        '/assets/js/lazy-load.js',
        '/manifest.json'
    ];
    
    // Install event - cache critical resources
    self.addEventListener('install', event => {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => {
                    console.log('Caching critical resources');
                    return cache.addAll(CRITICAL_RESOURCES);
                })
                .then(() => self.skipWaiting())
        );
    });

    // Enhanced URL utility function for cache busting and protocol fixes
    const getFixedUrl = (req) => {
        const now = Date.now();
        const url = new URL(req.url);

        // 1. Fixed http URL - sync with location.protocol
        url.protocol = self.location.protocol;

        // 2. Add query for cache-busting (GitHub Pages specific)
        if (url.hostname === self.location.hostname) {
            url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
        }
        
        return url.href;
    };

    /**
     *  @Lifecycle Activate
     *  Clean up old caches and claim all clients
     */
    self.addEventListener('activate', event => {
        event.waitUntil(
            Promise.all([
                // Clean up old caches
                caches.keys().then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            if (cacheName !== CACHE_NAME && 
                                cacheName !== RUNTIME_CACHE && 
                                cacheName !== OFFLINE_CACHE) {
                                console.log('Deleting old cache:', cacheName);
                                return caches.delete(cacheName);
                            }
                        })
                    );
                }),
                // Take control of all pages immediately
                self.clients.claim()
            ])
        );
    });

    /**
     *  @Functional Fetch
     *  All network requests are being intercepted here.
     *
     *  void respondWith(Promise<Response> r)
     */
    self.addEventListener('fetch', event => {
    // Skip some of cross-origin requests, like those for Google Analytics.
    if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
        // Stale-while-revalidate
        // similar to HTTP's stale-while-revalidate: https://www.mnot.net/blog/2007/12/12/stale
        // Upgrade from Jake's to Surma's: https://gist.github.com/surma/eb441223daaedf880801ad80006389f1
        const cached = caches.match(event.request)
        const fixedUrl = getFixedUrl(event.request)
        const fetched = fetch(fixedUrl, { cache: 'no-store' })
        const fetchedCopy = fetched.then(resp => resp.clone())

        // Call respondWith() with whatever we get first.
        // If the fetch fails (e.g disconnected), wait for the cache.
        // If there’s nothing in cache, wait for the fetch.
        // If neither yields a response, return offline pages.
        event.respondWith(
        Promise.race([fetched.catch(_ => cached), cached])
            .then(resp => resp || fetched)
            .catch(_ => { /* eat any errors */ })
        )

        // Update the cache with the version we fetched (only for ok status)
        event.waitUntil(
        Promise.all([fetchedCopy, caches.open("pwa-cache")])
            .then(([response, cache]) => response.ok && cache.put(event.request, response))
            .catch(_ => { /* eat any errors */ })
        )
    }
    })